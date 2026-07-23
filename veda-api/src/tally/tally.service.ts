import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import { Inventory } from '../inventory/schemas/inventory.schema';
import { Appointment } from '../appointments/schemas/appointment.schema';
import { HospitalsService } from '../hospitals/hospitals.service';

// Tally accepts XML via Gateway of Tally → Import → Data, and — when its
// built-in HTTP/XML server is enabled (Tally Prime: F1 → Settings →
// Connectivity → Client/Server configuration, default port 9000) — also
// accepts XML requests directly over HTTP for both push and pull. This
// service supports both: a downloadable XML file for manual import, and a
// live HTTP push/pull when the hospital has configured a reachable Tally
// server URL. A standard local desktop Tally with no exposed port cannot be
// reached by a cloud backend — that's a Tally networking constraint, not
// something the config below can work around.
@Injectable()
export class TallyService {
  constructor(
    @InjectModel(Inventory.name) private inventoryModel: Model<Inventory>,
    @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
    private readonly hospitalsService: HospitalsService,
  ) {}

  private async assertPremium(hospitalId: string) {
    const hospital = await this.hospitalsService.findOne(hospitalId);
    if (!hospital || hospital.plan !== 'PREMIUM') {
      throw new BadRequestException('Tally integration is a Premium feature. Upgrade your plan to use it.');
    }
    return hospital;
  }

  private async getTallyConfig(hospitalId: string) {
    const hospital = await this.assertPremium(hospitalId);
    const config: any = (hospital as any).tallyConfig;
    if (!config?.serverUrl) {
      throw new BadRequestException('No Tally server URL configured. Add it under Clinic Settings → Tally Integration.');
    }
    return { hospital, config };
  }

  private async postToTally(serverUrl: string, xmlBody: string): Promise<string> {
    try {
      const res = await axios.post(serverUrl, xmlBody, {
        headers: { 'Content-Type': 'text/xml' },
        timeout: 15000,
      });
      return res.data;
    } catch (error: any) {
      if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT' || error.code === 'ENOTFOUND') {
        throw new BadRequestException(
          `Couldn't reach Tally at that URL. Make sure Tally is running, its HTTP server is enabled (F1 → Settings → Connectivity), and this URL is actually reachable from the internet — a local desktop Tally on a home/clinic network usually is NOT reachable by a cloud server without exposing the port.`
        );
      }
      throw new BadRequestException(`Tally rejected the request: ${error.message}`);
    }
  }

  /**
   * ✅ Verifies the configured Tally server is actually reachable and
   * responding, before relying on it for real sync operations.
   */
  async testConnection(hospitalId: string) {
    const { hospital, config } = await this.getTallyConfig(hospitalId);

    const pingXml = `<ENVELOPE>
  <HEADER><TALLYREQUEST>Export Data</TALLYREQUEST></HEADER>
  <BODY>
    <EXPORTDATA>
      <REQUESTDESC>
        <REPORTNAME>List of Companies</REPORTNAME>
      </REQUESTDESC>
    </EXPORTDATA>
  </BODY>
</ENVELOPE>`;

    const response = await this.postToTally(config.serverUrl, pingXml);
    const reachable = !!response && response.length > 0;

    await this.hospitalsService.update((hospital as any)._id.toString(), {
      tallyConfig: { ...config, lastSyncedAt: new Date(), lastSyncStatus: reachable ? 'CONNECTED' : 'UNREACHABLE' },
    } as any);

    return { connected: reachable, message: reachable ? 'Tally is reachable and responded.' : 'Tally did not return a valid response.' };
  }

  /**
   * ✅ PULL: fetches live stock items directly from Tally via its Collection
   * export API, so inventory shown in the SaaS reflects what's actually in
   * Tally — not the reverse XML-download-and-manually-import flow.
   */
  async pullStockItemsFromTally(hospitalId: string) {
    const { hospital, config } = await this.getTallyConfig(hospitalId);

    const collectionXml = `<ENVELOPE>
  <HEADER>
    <VERSION>1</VERSION>
    <TALLYREQUEST>EXPORT</TALLYREQUEST>
    <TYPE>COLLECTION</TYPE>
    <ID>VaidyaStockCollection</ID>
  </HEADER>
  <BODY>
    <DESC>
      <STATICVARIABLES>
        <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
        ${config.companyName ? `<SVCURRENTCOMPANY>${config.companyName}</SVCURRENTCOMPANY>` : ''}
      </STATICVARIABLES>
      <TDL>
        <TDLMESSAGE>
          <COLLECTION NAME="VaidyaStockCollection" ISMODIFY="No">
            <TYPE>StockItem</TYPE>
            <FETCH>NAME,PARENT,CLOSINGBALANCE,CLOSINGRATE,CLOSINGVALUE,BASEUNITS</FETCH>
          </COLLECTION>
        </TDLMESSAGE>
      </TDL>
    </DESC>
  </BODY>
</ENVELOPE>`;

    const rawXml = await this.postToTally(config.serverUrl, collectionXml);

    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
    let parsed: any;
    try {
      parsed = parser.parse(rawXml);
    } catch (error) {
      throw new BadRequestException('Tally responded, but the data could not be parsed. Check your Tally version and configuration.');
    }

    // Tally's collection export nests items under COLLECTION > STOCKITEM (array or single object)
    const rawItems = parsed?.ENVELOPE?.VaidyaStockCollection?.STOCKITEM
      || parsed?.ENVELOPE?.COLLECTION?.STOCKITEM
      || [];
    const items = Array.isArray(rawItems) ? rawItems : [rawItems];

    const results = items.filter(Boolean).map((item: any) => ({
      name: item.NAME || item['@_NAME'] || 'Unknown',
      parent: item.PARENT || '',
      closingBalance: item.CLOSINGBALANCE || '0',
      closingRate: item.CLOSINGRATE || '0',
      closingValue: item.CLOSINGVALUE || '0',
      unit: item.BASEUNITS || 'Nos',
    }));

    await this.hospitalsService.update((hospital as any)._id.toString(), {
      tallyConfig: { ...config, lastSyncedAt: new Date(), lastSyncStatus: `PULLED ${results.length} ITEMS` },
    } as any);

    return { count: results.length, items: results };
  }

  private escapeXml(s: any): string {
    return String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  private tallyDate(d: Date): string {
    // Tally expects YYYYMMDD
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}${mm}${dd}`;
  }

  /**
   * Stock items — one <TALLYMESSAGE> per inventory item, with current stock
   * as the opening balance. Import under Gateway of Tally → Import → Masters.
   */
  async exportStockItems(hospitalId: string): Promise<string> {
    await this.assertPremium(hospitalId);

    const items = await this.inventoryModel.find({ hospitalId }).exec();

    const messages = items.map(item => `
    <TALLYMESSAGE xmlns:UDF="TallyUDF">
      <STOCKITEM NAME="${this.escapeXml(item.name)}" ACTION="Create">
        <NAME.LIST><NAME>${this.escapeXml(item.name)}</NAME></NAME.LIST>
        <PARENT>${this.escapeXml(item.category || 'Primary')}</PARENT>
        <BASEUNITS>${this.escapeXml(item.unit || 'Nos')}</BASEUNITS>
        <OPENINGBALANCE>${item.quantity || 0} ${this.escapeXml(item.unit || 'Nos')}</OPENINGBALANCE>
        <OPENINGRATE>${(item.price || 0).toFixed(2)}/${this.escapeXml(item.unit || 'Nos')}</OPENINGRATE>
        <OPENINGVALUE>${((item.quantity || 0) * (item.price || 0)).toFixed(2)}</OPENINGVALUE>
      </STOCKITEM>
    </TALLYMESSAGE>`).join('');

    return this.wrapEnvelope('Masters', messages);
  }

  /**
   * Sales vouchers — one per paid appointment/visit in the date range, so the
   * clinic's billing shows up in Tally as proper sales entries against a
   * "Patient Billing" ledger. Import under Gateway of Tally → Import → Vouchers.
   */
  async exportSalesVouchers(hospitalId: string, startDate: string, endDate: string): Promise<string> {
    await this.assertPremium(hospitalId);

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const appointments = await this.appointmentModel.find({
      hospitalId,
      startTime: { $gte: start, $lte: end },
      paymentStatus: 'PAID',
    }).populate('patientId', 'name uhid').exec();

    const messages = appointments.map((appt: any) => {
      const amount = appt.finalBilledAmount || appt.amount || 0;
      const patientName = appt.patientId?.name || 'Walk-in Patient';
      const voucherDate = this.tallyDate(new Date(appt.startTime));
      const narration = `${appt.treatmentName || 'Consultation'} — UHID ${appt.patientId?.uhid || 'N/A'}`;

      return `
    <TALLYMESSAGE xmlns:UDF="TallyUDF">
      <VOUCHER VCHTYPE="Sales" ACTION="Create">
        <DATE>${voucherDate}</DATE>
        <VOUCHERTYPENAME>Sales</VOUCHERTYPENAME>
        <PARTYLEDGERNAME>${this.escapeXml(patientName)}</PARTYLEDGERNAME>
        <NARRATION>${this.escapeXml(narration)}</NARRATION>
        <ALLLEDGERENTRIES.LIST>
          <LEDGERNAME>${this.escapeXml(patientName)}</LEDGERNAME>
          <ISDEEMEDPOSITIVE>Yes</ISDEEMEDPOSITIVE>
          <AMOUNT>-${amount.toFixed(2)}</AMOUNT>
        </ALLLEDGERENTRIES.LIST>
        <ALLLEDGERENTRIES.LIST>
          <LEDGERNAME>Patient Billing</LEDGERNAME>
          <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>
          <AMOUNT>${amount.toFixed(2)}</AMOUNT>
        </ALLLEDGERENTRIES.LIST>
      </VOUCHER>
    </TALLYMESSAGE>`;
    }).join('');

    return this.wrapEnvelope('Vouchers', messages);
  }

  /**
   * ✅ PUSH (live): same sales voucher XML as exportSalesVouchers, but posted
   * directly to the configured Tally server instead of downloaded for manual
   * import — the actual "billing flows into Tally" half of the integration.
   */
  async pushSalesVouchersLive(hospitalId: string, startDate: string, endDate: string) {
    const { hospital, config } = await this.getTallyConfig(hospitalId);
    const xml = await this.exportSalesVouchers(hospitalId, startDate, endDate);

    const response = await this.postToTally(config.serverUrl, xml);

    // Tally's import response includes CREATED/ALTERED/ERRORS counts in its own XML.
    const parser = new XMLParser({ ignoreAttributes: false });
    let created = 0, errors = 0;
    try {
      const parsed = parser.parse(response);
      const body = parsed?.ENVELOPE?.BODY?.DATA?.IMPORTRESULT;
      created = Number(body?.CREATED || 0);
      errors = Number(body?.ERRORS || 0);
    } catch {
      // If Tally's response isn't parseable, we still know the POST succeeded.
    }

    await this.hospitalsService.update((hospital as any)._id.toString(), {
      tallyConfig: { ...config, lastSyncedAt: new Date(), lastSyncStatus: `PUSHED ${created} VOUCHERS${errors ? `, ${errors} ERRORS` : ''}` },
    } as any);

    return { created, errors, rawResponse: response?.slice(0, 500) };
  }

  private wrapEnvelope(reportName: string, messages: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<ENVELOPE>
  <HEADER>
    <TALLYREQUEST>Import Data</TALLYREQUEST>
  </HEADER>
  <BODY>
    <IMPORTDATA>
      <REQUESTDESC>
        <REPORTNAME>${reportName}</REPORTNAME>
        <STATICVARIABLES>
          <SVCURRENTCOMPANY>##SVCURRENTCOMPANY##</SVCURRENTCOMPANY>
        </STATICVARIABLES>
      </REQUESTDESC>
      <REQUESTDATA>${messages}
      </REQUESTDATA>
    </IMPORTDATA>
  </BODY>
</ENVELOPE>`;
  }
}
