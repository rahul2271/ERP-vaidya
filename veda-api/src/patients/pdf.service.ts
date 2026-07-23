import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit'; 
import * as QRCode from 'qrcode';

@Injectable()
export class PdfService {
  async generateDischargePdf(data: any): Promise<Buffer> {
    return new Promise((resolve) => {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const buffers: Buffer[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      const hospital = data.hospitalDetails || {};
      const patient = data.patientProfile || {};
      const treatments = data.clinicalSummary?.treatments || [];
      const financial = data.financialSummary || {};

      // 🚀 EXTRACT THE SPECIFIC DOCTOR & NOTES
      let finalChiefComplaints = patient.chiefComplaints || "";
      let finalDiagnosis = patient.diagnosis || "";
      let attendingDoctor = patient.assignedDoctor || "Attending Physician";

      for (let i = treatments.length - 1; i >= 0; i--) {
        const t = treatments[i];
        const cc = t?.vitals?.chiefComplaints || t?.chiefComplaints;
        const diag = t?.vitals?.diagnosis || t?.diagnosis;

        if (cc && cc !== "N/A" && cc.trim() !== "") finalChiefComplaints = cc;
        if (diag && diag !== "N/A" && diag.trim() !== "") finalDiagnosis = diag;

        if (t.doctor) {
          attendingDoctor = t.doctor;
        } else if (t.therapist && t.therapist !== "Staff" && t.therapist !== "System User") {
          attendingDoctor = t.therapist; 
        }
        if (finalChiefComplaints && finalDiagnosis && attendingDoctor !== "Attending Physician") break;
      }

      if (!finalChiefComplaints || finalChiefComplaints === "N/A") finalChiefComplaints = "No specific chief complaints recorded.";
      if (!finalDiagnosis || finalDiagnosis === "N/A") finalDiagnosis = "Pending Clinical Diagnosis";

      const displayDoctorName = attendingDoctor.toLowerCase().startsWith("dr") ? attendingDoctor : `Dr. ${attendingDoctor}`;

      // ==========================================
      // --- 1. HEADER (DYNAMIC SAAS BRANDING) ---
      // ==========================================
      doc.fontSize(22).font('Helvetica-Bold').fillColor('#25786f').text(hospital.name || 'Vaidya Medical Center', { align: 'center' });
      
      if (hospital.tagline) {
        doc.fontSize(10).font('Helvetica-Oblique').fillColor('#54b0a4').text(hospital.tagline, { align: 'center' });
        doc.moveDown(0.5);
      }

      doc.fontSize(10).font('Helvetica').fillColor('#65766c').text(`${hospital.location} | Contact: ${hospital.contact}`, { align: 'center' });
      
      if (hospital.gstNumber || hospital.registrationNumber) {
        const legalText = [
          hospital.gstNumber ? `GSTIN: ${hospital.gstNumber}` : null,
          hospital.registrationNumber ? `REG NO: ${hospital.registrationNumber}` : null
        ].filter(Boolean).join('  |  ');
        doc.fontSize(8).fillColor('#aebab3').text(legalText, { align: 'center' });
      }
      
      // Fixed Header Box Positioning
      doc.y += 15;
      const headerRectY = doc.y;
      doc.rect(200, headerRectY, 195, 20).fill('#25786f');
      doc.fillColor('#ffffff').fontSize(10).font('Helvetica-Bold').text('OFFICIAL DISCHARGE SUMMARY', 200, headerRectY + 5, { align: 'center', width: 195 });
      
      // 🚀 STRICT CURSOR MANAGEMENT
      doc.y = headerRectY + 45; 

      // ==========================================
      // --- 2. NABH REGISTRATION STRIP ---
      // UHID + visit type/number are the two identifiers NABH requires for
      // positive patient identification — shown prominently, separate from
      // the general patient details block below.
      // ==========================================
      const reg = data.registrationDetails || {};
      const regY = doc.y;
      const regTypeColor = reg.visitType === 'IPD' ? '#4c9a5f' : reg.visitType === 'DAY_CARE' ? '#c98a3a' : '#25786f';

      doc.rect(50, regY, 500, 34).fillAndStroke('#f6f8f7', '#eaeeec');
      doc.fillColor('#65766c').font('Helvetica-Bold').fontSize(8).text('UHID', 60, regY + 8);
      doc.fillColor('#232a26').font('Helvetica-Bold').fontSize(11).text(patient.uhid || 'N/A', 60, regY + 18);

      doc.fillColor('#65766c').font('Helvetica-Bold').fontSize(8).text('VISIT TYPE', 190, regY + 8);
      doc.fillColor(regTypeColor).font('Helvetica-Bold').fontSize(11).text((reg.visitType || 'OPD').replace('_', ' '), 190, regY + 18);

      doc.fillColor('#65766c').font('Helvetica-Bold').fontSize(8).text('REGISTRATION NO.', 310, regY + 8);
      doc.fillColor('#232a26').font('Helvetica-Bold').fontSize(11).text(reg.visitNumber || 'N/A', 310, regY + 18);

      doc.fillColor('#65766c').font('Helvetica-Bold').fontSize(8).text('ADMISSION', 430, regY + 8);
      doc.fillColor('#232a26').font('Helvetica').fontSize(9).text(reg.admissionDate ? new Date(reg.admissionDate).toLocaleDateString('en-IN') : 'N/A (OPD)', 430, regY + 19);

      doc.y = regY + 44;

      // Second row: discharge date + follow-up, and if this OPD visit was ever
      // admitted, show the original OPD number too for full traceability.
      if (reg.dischargeDate || reg.nextFollowUpDate || (reg.opdNumber && reg.visitType !== 'OPD')) {
        const regY2 = doc.y;
        doc.rect(50, regY2, 500, 26).fillAndStroke('#ffffff', '#eaeeec');

        if (reg.dischargeDate) {
          doc.fillColor('#65766c').font('Helvetica-Bold').fontSize(8).text('DISCHARGE DATE', 60, regY2 + 6);
          doc.fillColor('#232a26').font('Helvetica-Bold').fontSize(9).text(new Date(reg.dischargeDate).toLocaleDateString('en-IN'), 60, regY2 + 16);
        }
        if (reg.nextFollowUpDate) {
          doc.fillColor('#65766c').font('Helvetica-Bold').fontSize(8).text('NEXT FOLLOW-UP', 220, regY2 + 6);
          doc.fillColor('#c98a3a').font('Helvetica-Bold').fontSize(9).text(new Date(reg.nextFollowUpDate).toLocaleDateString('en-IN'), 220, regY2 + 16);
        }
        if (reg.opdNumber && reg.visitType !== 'OPD') {
          doc.fillColor('#65766c').font('Helvetica-Bold').fontSize(8).text('ORIGINAL OPD NO.', 380, regY2 + 6);
          doc.fillColor('#82938a').font('Helvetica').fontSize(9).text(reg.opdNumber, 380, regY2 + 16);
        }
        doc.y = regY2 + 34;
      }

      // Third row: condition at discharge + advice given — NABH-mandated
      // discharge summary elements. Uses sequential auto-advance (not absolute
      // offsets) since advice text can wrap to multiple lines.
      if (reg.dischargeCondition || reg.dischargeAdvice) {
        doc.moveDown(0.3);
        if (reg.dischargeCondition) {
          doc.fillColor('#65766c').font('Helvetica-Bold').fontSize(8).text('CONDITION AT DISCHARGE', 50, doc.y);
          doc.moveDown(0.2);
          doc.fillColor('#232a26').font('Helvetica-Bold').fontSize(9).text(reg.dischargeCondition, 50, doc.y, { width: 500 });
          doc.moveDown(0.5);
        }
        if (reg.dischargeAdvice) {
          doc.fillColor('#65766c').font('Helvetica-Bold').fontSize(8).text('ADVICE ON DISCHARGE', 50, doc.y);
          doc.moveDown(0.2);
          doc.fillColor('#232a26').font('Helvetica').fontSize(9).text(reg.dischargeAdvice, 50, doc.y, { width: 500 });
        }
        doc.moveDown(0.8);
      }

      // ==========================================
      // --- 2b. CONVERSION HISTORY (audit trail) ---
      // ==========================================
      const history = data.conversionHistory || [];
      if (history.length > 0) {
        doc.fillColor('#65766c').font('Helvetica-Bold').fontSize(8).text('EPISODE HISTORY', 50, doc.y);
        doc.moveDown(0.3);
        history.forEach((h: any) => {
          const dateStr = h.timestamp ? new Date(h.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '';
          doc.fillColor('#aebab3').font('Helvetica').fontSize(7).text(`${dateStr} — `, 50, doc.y, { continued: true, width: 500 });
          doc.fillColor('#505e56').text(h.details || '', { width: 440 });
          doc.moveDown(0.3);
        });
        doc.moveDown(0.5);
      }

      // ==========================================
      // --- 3. PATIENT INFO & CLINICAL NOTES ---
      // ==========================================
      doc.fillColor('#000000');
      const startInfoY = doc.y + 10;
      
      doc.fontSize(10).font('Helvetica-Bold').fillColor('#65766c').text('PATIENT DETAILS', 50, startInfoY);
      doc.font('Helvetica-Bold').fillColor('#000000').fontSize(12).text(patient.name || 'N/A', 50, startInfoY + 15);
      doc.font('Helvetica').fontSize(10).text(`Age/Sex: ${patient.age || '--'} / ${patient.gender || '--'}`, 50, startInfoY + 30);
      doc.text(`Mobile: ${patient.mobile || 'N/A'}`, 50, startInfoY + 45);

      doc.fontSize(10).font('Helvetica-Bold').fillColor('#65766c').text('ATTENDING PHYSICIAN', 350, startInfoY);
      doc.font('Helvetica').fillColor('#000000').fontSize(10).text(displayDoctorName, 350, startInfoY + 15);
      doc.text(`Report Date: ${new Date().toLocaleDateString('en-IN')}`, 350, startInfoY + 30);
      
      // 🚀 THE FIX: Force the Y cursor to move BELOW the info block
      doc.y = startInfoY + 75; 

      // Draw Clinical Context Box with strict spacing
      const boxY = doc.y;
      doc.rect(50, boxY, 500, 50).fillAndStroke('#f6f8f7', '#eaeeec');
      doc.fillColor('#000000').font('Helvetica-Bold').text('Chief Complaints:', 60, boxY + 10);
      doc.font('Helvetica').text(finalChiefComplaints, 160, boxY + 10, { width: 150 });
      
      doc.font('Helvetica-Bold').text('Final Diagnosis:', 320, boxY + 10);
      doc.fillColor('#d9564a').text(finalDiagnosis, 410, boxY + 10, { width: 130 });

      // 🚀 THE FIX: Move cursor down again before the table header
      doc.y = boxY + 70;

      // ==========================================
      // --- 4. CLINICAL RECORD TABLE ---
      // ==========================================
      doc.fontSize(12).font('Helvetica-Bold').fillColor('#25786f').text('TREATMENT & PHARMACY RECORD', 50, doc.y);
      doc.y += 10;

      const tableHeaderY = doc.y;
      doc.fontSize(9).font('Helvetica-Bold').fillColor('#65766c');
      doc.text('DATE', 50, tableHeaderY);
      doc.text('PROCEDURE', 120, tableHeaderY);
      doc.text('VITALS', 260, tableHeaderY);
      doc.text('MEDICINES PRESCRIBED', 350, tableHeaderY);
      
      doc.y = tableHeaderY + 15;
      doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor('#eaeeec').stroke();
      doc.y += 10;

      // Table Body
      treatments.forEach((t: any) => {
        // Prevent page break cut-offs
        if (doc.y > 700) doc.addPage();

        const rowY = doc.y;
        
        doc.fillColor('#505e56').font('Helvetica').fontSize(9).text(new Date(t.date).toLocaleDateString(), 50, rowY, { width: 60 });
        doc.fillColor('#25786f').font('Helvetica-Bold').text(t.treatment?.toUpperCase() || 'N/A', 120, rowY, { width: 130 });
        
        // Vitals
        doc.fillColor('#505e56').font('Helvetica').fontSize(8);
        if (t.vitals && t.vitals.preBp && t.vitals.preBp !== '---') {
            doc.text(`BP: ${t.vitals.preBp}/${t.vitals.postBp}`, 260, rowY);
            doc.text(`PR: ${t.vitals.pulse}`, 260, rowY + 12);
        } else {
            doc.fillColor('#aebab3').text('N/A', 260, rowY);
        }

        // Medicines
        if (t.medicinesUsed && t.medicinesUsed.length > 0) {
            let medY = rowY;
            doc.fillColor('#16a34a'); 
            t.medicinesUsed.forEach((m: any) => {
                doc.text(`• ${m.name} (x${m.quantity})`, 350, medY, { width: 190 });
                medY += 12;
            });
        } else {
            doc.fillColor('#aebab3').text('None prescribed', 350, rowY, { width: 150 });
        }
        
        // Calculate the height of the tallest column in this row
        const spaceNeeded = Math.max(30, (t.medicinesUsed?.length || 1) * 14);
        doc.y = rowY + spaceNeeded;
        
        doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor('#f1f5f9').stroke();
        doc.y += 10;
      });

      // ==========================================
      // --- 4. FINANCIAL SUMMARY ---
      // ==========================================
      if (doc.y > 600) doc.addPage(); // Ensure enough room for footer
      doc.y += 20;

      doc.fontSize(12).font('Helvetica-Bold').fillColor('#25786f').text('FINANCIAL SUMMARY', 50, doc.y);
      doc.y += 5;
      doc.moveTo(50, doc.y).lineTo(200, doc.y).strokeColor('#25786f').stroke();
      doc.y += 15;

      doc.fontSize(12).font('Helvetica-Bold').fillColor('#000000').text(`Total Billed Amount: Rs. ${financial.finalAmount?.toLocaleString('en-IN') || 0}`, 50, doc.y, { align: 'right', width: 500 });
      doc.y += 15;
      
      const isPaid = financial.paymentStatus?.toUpperCase() === 'PAID';
      doc.fontSize(10).fillColor(isPaid ? '#16a34a' : '#dc2626').text(`Payment Status: ${isPaid ? 'SETTLED' : 'PENDING'}`, 50, doc.y, { align: 'right', width: 500 });

      // ==========================================
      // --- 5. SIGNATURES ---
      // ==========================================
      doc.y += 60;
      const sigY = doc.y;
      
      // Admin Sig
      doc.moveTo(50, sigY).lineTo(200, sigY).strokeColor('#cbd5e1').stroke();
      doc.fillColor('#65766c').fontSize(9).font('Helvetica-Bold').text('Hospital Administrator', 50, sigY + 5);

      // Doctor Sig
      doc.fillColor('#25786f').fontSize(18).font('Times-Italic').text(displayDoctorName.replace('Dr. ', ''), 350, sigY - 20, { width: 200, align: 'center' });
      doc.moveTo(350, sigY).lineTo(550, sigY).strokeColor('#cbd5e1').stroke();
      doc.fillColor('#000000').fontSize(10).font('Helvetica-Bold').text(displayDoctorName, 350, sigY + 5, { width: 200, align: 'center' });
      doc.fillColor('#65766c').fontSize(8).font('Helvetica').text('Attending Medical Officer', 350, sigY + 18, { width: 200, align: 'center' });

      // Footer
      doc.fontSize(8).fillColor('#aebab3').text('This is a computer-generated document and requires no physical signature.', 50, 780, { align: 'center', width: 500 });

      doc.end();
    });
  }

  /**
   * Generates a compact registration ticket (OPD/IPD/Day Care) with a QR code
   * that encodes the visit number + UHID for front-desk/pharmacy verification —
   * per NABH guidance that OPD slips typically carry a scannable code.
   */
  async generateVisitTicketPdf(data: {
    hospital: { name: string; location?: string; contact?: string };
    patient: { name: string; age?: number; gender?: string; uhid?: string };
    visitType: string;
    visitNumber: string;
    doctorName?: string;
    treatmentName?: string;
    roomName?: string;
    dateTime: Date;
  }): Promise<Buffer> {
    const { hospital, patient, visitType, visitNumber, doctorName, treatmentName, roomName, dateTime } = data;

    // A compact ticket size (like a receipt slip) rather than full A4. Height
    // is generous on purpose — better to have blank space at the bottom than
    // risk PDFKit silently starting a second page for a long clinic/patient name.
    const PAGE_W = 283;
    const PAGE_H = 620;
    const doc = new PDFDocument({ margin: 24, size: [PAGE_W, PAGE_H], autoFirstPage: true });
    const buffers: Buffer[] = [];
    const contentWidth = PAGE_W - 48; // margin 24 each side

    const qrPayload = JSON.stringify({ uhid: patient.uhid, visitType, visitNumber });
    const qrDataUrl = await QRCode.toDataURL(qrPayload, { margin: 1, width: 200 });
    const qrBuffer = Buffer.from(qrDataUrl.split(',')[1], 'base64');

    // Truncates a string to a safe length so a single .text() call can never
    // wrap to a second line and throw off the cursor math below.
    const clip = (s: string, max: number) => (s && s.length > max ? s.slice(0, max - 1) + '…' : (s || ''));

    return new Promise((resolve) => {
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      const typeColor = visitType === 'IPD' ? '#4c9a5f' : visitType === 'DAY_CARE' ? '#c98a3a' : '#25786f';
      const typeLabel = visitType === 'DAY_CARE' ? 'DAY CARE' : visitType;
      const LEFT = 24;

      // Every line's position is tracked by hand in this local variable and
      // advanced by a fixed, known amount after each draw call. This
      // deliberately does NOT use doc.y, moveDown(), or auto-advance —
      // mixing those with explicit coordinates was the actual source of the
      // overlap/spacing bugs, since moveDown()'s step size silently changes
      // with whatever font size happens to be active at the moment it's called.
      let y = 24;

      const line = (text: string, opts: { size?: number; bold?: boolean; color?: string; align?: 'left' | 'center'; gap?: number } = {}) => {
        const { size = 9, bold = false, color = '#232a26', align = 'left', gap = size + 6 } = opts;
        doc.fontSize(size).font(bold ? 'Helvetica-Bold' : 'Helvetica').fillColor(color)
          .text(text, LEFT, y, { width: contentWidth, align, lineBreak: false });
        y += gap;
      };

      const spacer = (amount: number) => { y += amount; };

      line(clip(hospital.name || 'Vaidya Clinic', 40), { size: 14, bold: true, align: 'center', gap: 18 });
      if (hospital.location) {
        line(clip(hospital.location, 60), { size: 7, color: '#65766c', align: 'center', gap: 12 });
      }
      spacer(6);

      doc.rect(LEFT, y, contentWidth, 20).fill(typeColor);
      doc.fontSize(11).font('Helvetica-Bold').fillColor('#ffffff')
        .text(`${typeLabel} TICKET`, LEFT, y + 5, { width: contentWidth, align: 'center', lineBreak: false });
      y += 20;
      spacer(8);

      line(visitNumber, { size: 9, bold: true, align: 'center', gap: 14 });

      doc.moveTo(LEFT, y).lineTo(LEFT + contentWidth, y).strokeColor('#eaeeec').stroke();
      spacer(14);

      line('PATIENT', { size: 8, color: '#65766c', gap: 12 });
      line(clip(patient.name, 35), { size: 11, bold: true, gap: 14 });
      line(`${patient.age || '--'} yrs / ${patient.gender || '--'}  |  UHID: ${patient.uhid || 'N/A'}`, { size: 8, color: '#65766c', gap: 18 });

      if (doctorName) {
        line('DOCTOR', { size: 8, color: '#65766c', gap: 12 });
        line(clip(doctorName, 35), { size: 10, bold: true, gap: 18 });
      }

      if (treatmentName) {
        line('CONSULTATION / THERAPY', { size: 8, color: '#65766c', gap: 12 });
        line(clip(treatmentName, 35), { size: 10, bold: true, gap: 18 });
      }

      if (roomName) {
        line('ROOM', { size: 8, color: '#65766c', gap: 12 });
        line(clip(roomName, 35), { size: 10, bold: true, gap: 18 });
      }

      line('DATE & TIME', { size: 8, color: '#65766c', gap: 12 });
      line(dateTime.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }), { size: 10, bold: true, gap: 24 });

      // Verification QR — scan to confirm UHID + visit number match at pharmacy/front desk
      const qrSize = 90;
      doc.image(qrBuffer, (PAGE_W - qrSize) / 2, y, { width: qrSize, height: qrSize });
      y += qrSize;
      spacer(8);

      line('Scan to verify patient & visit number', { size: 6.5, color: '#82938a', align: 'center', gap: 12 });
      line('Computer-generated ticket — no signature required.', { size: 6.5, color: '#aebab3', align: 'center', gap: 12 });

      doc.end();
    });
  }
}