"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TallyService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const axios_1 = __importDefault(require("axios"));
const fast_xml_parser_1 = require("fast-xml-parser");
const inventory_schema_1 = require("../inventory/schemas/inventory.schema");
const appointment_schema_1 = require("../appointments/schemas/appointment.schema");
const hospitals_service_1 = require("../hospitals/hospitals.service");
let TallyService = class TallyService {
    inventoryModel;
    appointmentModel;
    hospitalsService;
    constructor(inventoryModel, appointmentModel, hospitalsService) {
        this.inventoryModel = inventoryModel;
        this.appointmentModel = appointmentModel;
        this.hospitalsService = hospitalsService;
    }
    async assertPremium(hospitalId) {
        const hospital = await this.hospitalsService.findOne(hospitalId);
        if (!hospital || hospital.plan !== 'PREMIUM') {
            throw new common_1.BadRequestException('Tally integration is a Premium feature. Upgrade your plan to use it.');
        }
        return hospital;
    }
    async getTallyConfig(hospitalId) {
        const hospital = await this.assertPremium(hospitalId);
        const config = hospital.tallyConfig;
        if (!config?.serverUrl) {
            throw new common_1.BadRequestException('No Tally server URL configured. Add it under Clinic Settings → Tally Integration.');
        }
        return { hospital, config };
    }
    async postToTally(serverUrl, xmlBody) {
        try {
            const res = await axios_1.default.post(serverUrl, xmlBody, {
                headers: { 'Content-Type': 'text/xml' },
                timeout: 15000,
            });
            return res.data;
        }
        catch (error) {
            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT' || error.code === 'ENOTFOUND') {
                throw new common_1.BadRequestException(`Couldn't reach Tally at that URL. Make sure Tally is running, its HTTP server is enabled (F1 → Settings → Connectivity), and this URL is actually reachable from the internet — a local desktop Tally on a home/clinic network usually is NOT reachable by a cloud server without exposing the port.`);
            }
            throw new common_1.BadRequestException(`Tally rejected the request: ${error.message}`);
        }
    }
    async testConnection(hospitalId) {
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
        await this.hospitalsService.update(hospital._id.toString(), {
            tallyConfig: { ...config, lastSyncedAt: new Date(), lastSyncStatus: reachable ? 'CONNECTED' : 'UNREACHABLE' },
        });
        return { connected: reachable, message: reachable ? 'Tally is reachable and responded.' : 'Tally did not return a valid response.' };
    }
    async pullStockItemsFromTally(hospitalId) {
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
        const parser = new fast_xml_parser_1.XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
        let parsed;
        try {
            parsed = parser.parse(rawXml);
        }
        catch (error) {
            throw new common_1.BadRequestException('Tally responded, but the data could not be parsed. Check your Tally version and configuration.');
        }
        const rawItems = parsed?.ENVELOPE?.VaidyaStockCollection?.STOCKITEM
            || parsed?.ENVELOPE?.COLLECTION?.STOCKITEM
            || [];
        const items = Array.isArray(rawItems) ? rawItems : [rawItems];
        const results = items.filter(Boolean).map((item) => ({
            name: item.NAME || item['@_NAME'] || 'Unknown',
            parent: item.PARENT || '',
            closingBalance: item.CLOSINGBALANCE || '0',
            closingRate: item.CLOSINGRATE || '0',
            closingValue: item.CLOSINGVALUE || '0',
            unit: item.BASEUNITS || 'Nos',
        }));
        await this.hospitalsService.update(hospital._id.toString(), {
            tallyConfig: { ...config, lastSyncedAt: new Date(), lastSyncStatus: `PULLED ${results.length} ITEMS` },
        });
        return { count: results.length, items: results };
    }
    escapeXml(s) {
        return String(s ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }
    tallyDate(d) {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}${mm}${dd}`;
    }
    async exportStockItems(hospitalId) {
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
    async exportSalesVouchers(hospitalId, startDate, endDate) {
        await this.assertPremium(hospitalId);
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        const appointments = await this.appointmentModel.find({
            hospitalId,
            startTime: { $gte: start, $lte: end },
            paymentStatus: 'PAID',
        }).populate('patientId', 'name uhid').exec();
        const messages = appointments.map((appt) => {
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
    async pushSalesVouchersLive(hospitalId, startDate, endDate) {
        const { hospital, config } = await this.getTallyConfig(hospitalId);
        const xml = await this.exportSalesVouchers(hospitalId, startDate, endDate);
        const response = await this.postToTally(config.serverUrl, xml);
        const parser = new fast_xml_parser_1.XMLParser({ ignoreAttributes: false });
        let created = 0, errors = 0;
        try {
            const parsed = parser.parse(response);
            const body = parsed?.ENVELOPE?.BODY?.DATA?.IMPORTRESULT;
            created = Number(body?.CREATED || 0);
            errors = Number(body?.ERRORS || 0);
        }
        catch {
        }
        await this.hospitalsService.update(hospital._id.toString(), {
            tallyConfig: { ...config, lastSyncedAt: new Date(), lastSyncStatus: `PUSHED ${created} VOUCHERS${errors ? `, ${errors} ERRORS` : ''}` },
        });
        return { created, errors, rawResponse: response?.slice(0, 500) };
    }
    wrapEnvelope(reportName, messages) {
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
};
exports.TallyService = TallyService;
exports.TallyService = TallyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(inventory_schema_1.Inventory.name)),
    __param(1, (0, mongoose_1.InjectModel)(appointment_schema_1.Appointment.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        hospitals_service_1.HospitalsService])
], TallyService);
//# sourceMappingURL=tally.service.js.map