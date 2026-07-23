import { 
  Injectable, 
  ConflictException, 
  NotFoundException, 
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException 
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose'; 
import { Appointment, AppointmentDocument } from './schemas/appointment.schema';
import { Treatment, TreatmentDocument } from '../treatments/schemas/treatment.schema'; 
import { CounterService } from '../common/counter.service';
import { HospitalsService } from '../hospitals/hospitals.service';
import { PdfService } from '../patients/pdf.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import * as nodemailer from 'nodemailer';

// 🚀 IMPORT WHATSAPP SERVICE
import { WhatsAppService } from '../whatsapp/whatsapp.service';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name) private appointmentModel: Model<AppointmentDocument>,
    @InjectModel(Treatment.name) private treatmentModel: Model<TreatmentDocument>, 
    private readonly whatsappService: WhatsAppService,
    private readonly counterService: CounterService,
    private readonly hospitalsService: HospitalsService,
    private readonly pdfService: PdfService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  /**
   * 1. CREATE APPOINTMENT (With No-Conflict & WhatsApp Triggers)
   */
  async create(createDto: any, user?: any) {
    const { patientId, treatmentName, startTime, duration, amount } = createDto;
    
    const start = new Date(startTime);
    if (isNaN(start.getTime())) throw new BadRequestException('Invalid start time.');

    const end = new Date(start.getTime() + (duration || 60) * 60000);

    const fallbackId = user?.userId || new Types.ObjectId();
    const therapistId = createDto.therapistId || fallbackId;
    const doctorId = createDto.doctorId || fallbackId;
    const roomId = createDto.roomId || new Types.ObjectId();
    const hospitalId = user?.hospitalId || createDto.hospitalId;

    if (!hospitalId) throw new BadRequestException('Hospital ID is required.');

    // ✅ OPD / IPD / DAY CARE registration number — defaults to OPD for a normal
    // booking. Direct IPD/Day Care creation is supported too (e.g. planned admissions),
    // though the more common path is booking OPD first, then admitting via
    // the /admit endpoint once the doctor decides admission is needed.
    const visitType = (createDto.visitType || 'OPD').toUpperCase();
    const registrationNumber = await this.counterService.generateNumber(hospitalId, visitType as any);
    const numberField = visitType === 'IPD' ? 'ipdNumber' : visitType === 'DAY_CARE' ? 'dayCareNumber' : 'opdNumber';

    let finalAmount = amount;
    if (!finalAmount) {
       const rateCard = await this.treatmentModel.findOne({ 
          name: { $regex: new RegExp(`^${treatmentName.trim()}$`, 'i') } 
       });
       finalAmount = rateCard ? rateCard.cost : 0; 
    }

    const newAppointment = new this.appointmentModel({
      ...createDto,
      patientId,
      treatmentName,
      startTime: start,
      endTime: end,
      therapistId,
      doctorId, 
      roomId,
      hospitalId,
      amount: finalAmount, 
      status: 'SCHEDULED',
      bookedById: user?.userId || null, // 🚀 Track who booked it
      visitType,
      [numberField]: registrationNumber,
      admissionDate: visitType !== 'OPD' ? new Date() : null,
    });

    try {
      // 🚀 1. SAVE TO DATABASE
      const savedAppt = await newAppointment.save();

      // 🚀 2. ASYNC WHATSAPP TRIGGER (Does not block the frontend response)
      try {
        await savedAppt.populate('patientId', 'name mobile');
        await savedAppt.populate('doctorId', 'name');
        
        const patient: any = savedAppt.patientId;
        const doc: any = savedAppt.doctorId;

        if (patient && patient.mobile) {
          const dateStr = start.toLocaleDateString('en-IN', { 
            timeZone: 'Asia/Kolkata', 
            weekday: 'long', 
            month: 'short', 
            day: 'numeric' 
          });

          const timeStr = start.toLocaleTimeString('en-IN', { 
            timeZone: 'Asia/Kolkata', 
            hour: '2-digit', 
            minute: '2-digit' 
          });
          
          this.whatsappService.sendAppointmentConfirmation(
            savedAppt.hospitalId.toString(),
            patient.mobile, 
            patient.name, 
            `Dr. ${doc.name}`, 
            dateStr, 
            timeStr
          ).catch(err => console.error("WhatsApp async delivery failed:", err.message));
        }
      } catch (waErr: any) {
        console.error("Failed to process WhatsApp notification:", waErr.message);
      }

      return savedAppt;

    } catch (error: any) {
      // 🚀 3. CATCH DOUBLE BOOKINGS (MongoDB Error 11000)
      if (error.code === 11000) {
        throw new ConflictException('Conflict: This slot was just booked by another staff member. Please select another time.');
      }
      throw new InternalServerErrorException('Failed to schedule appointment.');
    }
  }

  /**
   * 2. SCHEDULE 7 DAYS
   */
  async scheduleSevenDays(baseData: any, user?: any) {
    const appointments: Appointment[] = []; 
    const firstStart = new Date(baseData.startTime);

    for (let i = 0; i < 7; i++) {
      const dailyStart = new Date(firstStart);
      dailyStart.setDate(firstStart.getDate() + i);

      const newAppt = await this.create({
        ...baseData,
        startTime: dailyStart,
      }, user); 
      
      appointments.push(newAppt);
    }
    return appointments;
  }

  /**
   * 3. RECORD VITALS (Secured)
   */
  async recordVitals(id: string, vitalsData: any, user: any) {
    const appointment = await this.findOne(id);
    const apptDoctorId = appointment.doctorId?._id?.toString() || appointment.doctorId?.toString();

    if (user.role?.toUpperCase() === 'DOCTOR' && apptDoctorId !== user.userId) {
      throw new UnauthorizedException('Access Denied: You cannot modify vitals for another doctor\'s patient.');
    }

    return this.appointmentModel.findByIdAndUpdate(
      id,
      { 
        $set: { vitals: vitalsData }, 
        status: vitalsData.postBp ? 'COMPLETED' : 'IN_PROGRESS' 
      },
      { new: true }
    ).exec();
  }

  /**
   * 4. UPDATE APPOINTMENT (Foolproof Direct Save)
   */
  async update(id: string, data: any, user: any) {
    const appointment = await this.findOne(id);
    const apptDoctorId = appointment.doctorId?._id?.toString() || appointment.doctorId?.toString();

    if (user.role?.toUpperCase() === 'DOCTOR' && apptDoctorId !== user.userId) {
      throw new UnauthorizedException('Access Denied: You can only complete sessions for your assigned patients.');
    }

    if (data.medicines || data.medicinesUsed) {
      const medsToUpdate = data.medicines || data.medicinesUsed;
      data.medicinesUsed = medsToUpdate.map((m: any) => ({
        inventoryId: m.inventoryId,
        quantity: Number(m.quantity) || 1,
        priceAtTime: Number(m.price || m.priceAtTime || 0) 
      }));
      delete data.medicines; 
    }

    return this.appointmentModel.findByIdAndUpdate(
      id, 
      { $set: data }, 
      { new: true }
    ).populate('medicinesUsed.inventoryId').exec();
  }

  /**
   * 5. GET PATIENT BILLING SUMMARY & RECEIPT
   */
  async getPatientBillingSummary(patientId: string) {
    try {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const appointments = await this.appointmentModel
        .find({ 
           patientId, 
           status: { $in: ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'BOOKED'] }, 
           $or: [
              { paymentStatus: { $ne: 'PAID' } },
              { updatedAt: { $gte: todayStart } } 
           ]
        })
        .populate('medicinesUsed.inventoryId') 
        .sort({ startTime: -1 })
        .exec();

      let therapyTotal = 0;
      let pharmacyTotal = 0;
      let totalDiscount = 0; 
      let amountPaid = 0; 
      
      const therapyRows: { id: string; date: Date; name: string; cost: number }[] = [];
      const pharmacyRows: { date: Date; name: string; qty: number; unitPrice: number; total: number }[] = [];

      appointments.forEach(app => {
          const serviceCost = app.amount || 0;
          let sessionTotal = serviceCost; 

          if (serviceCost > 0) {
              therapyTotal += serviceCost;
              therapyRows.push({
                  id: app._id.toString(),
                  date: app.startTime,
                  name: app.treatmentName,
                  cost: serviceCost
              });
          }
          if (app.medicinesUsed && app.medicinesUsed.length > 0) {
              app.medicinesUsed.forEach((med: any) => {
                  const price = med.priceAtTime || med.inventoryId?.price || 0;
                  const lineTotal = price * med.quantity;
                  pharmacyTotal += lineTotal;
                  sessionTotal += lineTotal;
                  pharmacyRows.push({
                      date: app.startTime,
                      name: med.inventoryId?.name || "Unknown Item",
                      qty: med.quantity,
                      unitPrice: price,
                      total: lineTotal
                  });
              });
          }
          if (app.discount && app.discount.amount) {
              totalDiscount += app.discount.amount;
              sessionTotal -= app.discount.amount;
          }

          if (app.paymentStatus === 'PAID') {
              amountPaid += sessionTotal;
          }
      });

      const subtotal = therapyTotal + pharmacyTotal;
      const grandTotal = subtotal - totalDiscount;
      const balanceDue = grandTotal - amountPaid; 

     return {
         patientId,
         billDate: new Date(),
         completedSessions: appointments.length, 
         sections: {
             therapies: { title: "Panchakarma Procedures", items: therapyRows, total: therapyTotal },
             medicines: { title: "Pharmacy / Medicines", items: pharmacyRows, total: pharmacyTotal }
         },
         subtotal: subtotal,
         totalDiscount: totalDiscount, 
         finalAmount: grandTotal,      
         amountPaid: amountPaid,       
         balanceDue: balanceDue,       
         totalDue: `₹${balanceDue}`,
         paymentStatus: balanceDue <= 0 && grandTotal > 0 ? 'PAID' : 'PAYMENT DUE', 
         status: "Success"
     };

    } catch (error: any) {
      throw new InternalServerErrorException('Billing calculation failed: ' + error.message);
    }
  }

  /**
   * 6. DAILY REVENUE
   */
  async getDailyRevenue(hospitalId: string, date: string) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const completedAppointments = await this.appointmentModel.find({
      hospitalId,
      status: 'COMPLETED',
      startTime: { $gte: start, $lte: end }
    }).populate('medicinesUsed.inventoryId');

    let totalRevenue = 0;

    completedAppointments.forEach(app => {
        let sessionTotal = (app.amount || 0);
        
        if (app.medicinesUsed && Array.isArray(app.medicinesUsed)) {
            const medCost = app.medicinesUsed.reduce((sum, item: any) => {
                const price = item.priceAtTime || item.inventoryId?.price || 0;
                return sum + (price * item.quantity);
            }, 0);
            sessionTotal += medCost;
        }

        if (app.discount && app.discount.amount) {
            sessionTotal -= app.discount.amount;
        }
        totalRevenue += sessionTotal;
    });

    return { date, completedSessions: completedAppointments.length, totalRevenue: `₹${totalRevenue}` };
  }

  /**
   * 7-10. SCOPED FETCHING METHODS
   */
  async findDoctorAppointments(hospitalId: string, doctorId: string) {
    return this.appointmentModel.find({ hospitalId, doctorId })
    .populate('patientId', 'name mobile prakritiScores')
    .populate('therapistId', 'name')
    .populate('doctorId', 'name')
    .populate('roomId', 'name')
    .populate('medicinesUsed.inventoryId', 'name price unit')
    .populate('bookedById', 'name') // 🚀 Added Populator
    .sort({ startTime: 1 }).exec();
  }

  async findAll(hospitalId?: string) {
    const filter = hospitalId ? { hospitalId } : {};
    return this.appointmentModel.find(filter)
      .populate('patientId', 'name mobile prakritiScores')
      .populate('therapistId', 'name')
      .populate('doctorId', 'name')
      .populate('roomId', 'name')
      .populate('medicinesUsed.inventoryId', 'name price unit')
      .populate('bookedById', 'name') // 🚀 Added Populator
      .sort({ startTime: 1 }).exec();
  }

  async findByPatient(patientId: string) {
    return this.appointmentModel.find({ patientId })
      .populate({ path: 'medicinesUsed.inventoryId', select: 'name price unit' })
      .populate('doctorId', 'name')
      .populate('therapistId', 'name')
      .populate('bookedById', 'name') // 🚀 Added Populator
      .sort({ startTime: -1 }).exec();
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException(`Invalid ID: ${id}`);
    const appointment = await this.appointmentModel.findById(id)
      .populate({ path: 'patientId', populate: { path: 'assignedDoctorId', select: 'name' } })
      .populate('therapistId', 'name')
      .populate('doctorId', 'name')
      .populate('roomId', 'name')
      .populate('medicinesUsed.inventoryId', 'name price unit')
      .populate('bookedById', 'name') // 🚀 Added Populator
      .exec();
      
    if (!appointment) throw new NotFoundException(`Appointment not found`);
    return appointment;
  }

  async cleanupPlaceholderRecords() {
    const result = await this.appointmentModel.deleteMany({
      $or: [{ doctorId: { $type: "string" } }, { therapistId: { $type: "string" } }, { roomId: { $type: "string" } }]
    }).exec();
    return { message: 'Cleanup successful', deletedCount: result.deletedCount };
  }

  async handleRecommendation(data: any) {
    const { originalApptId, therapyId, action, patientId, treatmentName, startTime, roomId, therapistId } = data;

    await this.appointmentModel.updateOne(
      { _id: originalApptId, 'recommendedTherapies._id': therapyId },
      { $set: { 'recommendedTherapies.$.isProcessed': true } }
    );

    if (action === 'BOOK') {
      const treatment = await this.treatmentModel.findOne({ 
        name: { $regex: new RegExp(`^${treatmentName.trim()}$`, 'i') } 
      });
      const price = treatment ? (treatment as any).cost || (treatment as any).price : 0;
      
      const originalAppt = await this.appointmentModel.findById(originalApptId);
      if (!originalAppt) throw new NotFoundException('Original appointment record not found.');

      const sessionStart = startTime ? new Date(startTime) : new Date();
      const sessionEnd = new Date(sessionStart.getTime() + 60 * 60000); 

      return await this.appointmentModel.create({
        patientId,
        treatmentName,
        status: 'SCHEDULED', 
        amount: price,
        startTime: sessionStart,
        endTime: sessionEnd,
        hospitalId: originalAppt.hospitalId,
        doctorId: originalAppt.doctorId, 
        therapistId: therapistId || originalAppt.therapistId, 
        roomId: roomId || originalAppt.roomId 
      });
    }

    return { message: 'Recommendation marked as not taken.' };
  }

  async getAppointmentsByPatient(patientId: string, hospitalId: string) {
    return this.appointmentModel.find({ 
      patientId: patientId,
      hospitalId: hospitalId 
    })
    .populate('doctorId', 'name')
    .populate('roomId', 'name')
    .populate('bookedById', 'name') // 🚀 Added Populator
    .sort({ createdAt: -1 }) 
    .exec();
  }

  async getTodayAppointments(hospitalId: string) {
    const start = new Date();
    start.setHours(0,0,0,0);
    const end = new Date();
    end.setHours(23,59,59,999);

    return this.appointmentModel.find({
      hospitalId,
      startTime: { $gte: start, $lte: end },
      status: { $ne: 'CANCELLED' }
    })
    .populate('patientId', 'name prakritiScores')
    .populate('doctorId', 'name')
    .populate('roomId', 'name')
    .populate('bookedById', 'name') // 🚀 Added Populator
    .sort({ startTime: 1 }) 
    .exec();
  }

  async getDoctorDashboardQueue(hospitalId: string, dateStr: string) {
    const start = new Date(dateStr);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(dateStr);
    end.setHours(23, 59, 59, 999);

    return this.appointmentModel.find({
      hospitalId: hospitalId,
      startTime: { $gte: start, $lte: end },
      status: { $ne: 'CANCELLED' } 
    })
    .populate('patientId', 'name prakritiScores')
    .populate('doctorId', 'name')
    .populate('roomId', 'name')
    .populate('bookedById', 'name') // 🚀 Added Populator
    .sort({ startTime: 1 }) 
    .exec();
  }

  /**
   * ✅ ADMIT: converts an OPD visit into IPD or Day Care.
   * The original OPD number is kept on the record for traceability — only the
   * new IPD/Day Care number is freshly generated. The patient's UHID is
   * untouched throughout, since UHID lives on the Patient record, not the visit.
   */
  async admit(id: string, targetType: 'IPD' | 'DAY_CARE', hospitalId: string, userId?: string) {
    if (!hospitalId) {
      throw new BadRequestException('No hospital linked to your session. Please log out and back in.');
    }
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid appointment ID.');
    }

    try {
      const existing = await this.appointmentModel.findOne({ _id: id, hospitalId }).populate('patientId', 'name uhid').exec();
      if (!existing) throw new NotFoundException('Appointment not found.');

      if (existing.visitType && existing.visitType !== 'OPD') {
        throw new BadRequestException(`This visit is already ${existing.visitType}, not OPD — cannot admit again.`);
      }

      const registrationNumber = await this.counterService.generateNumber(hospitalId, targetType);
      const numberField = targetType === 'IPD' ? 'ipdNumber' : 'dayCareNumber';

      // Uses findByIdAndUpdate (not fetch + .save()) so this only validates the
      // fields being changed here — not the entire document, which can carry
      // legacy values in unrelated fields that predate a schema change.
      const updated = await this.appointmentModel.findByIdAndUpdate(
        id,
        { visitType: targetType, [numberField]: registrationNumber, admissionDate: new Date() },
        { new: true, runValidators: false }
      ).exec();

      // ✅ NABH-style traceable record: every OPD→IPD/Day Care admission is
      // logged with who did it, when, and the exact number change — this is
      // the "filing record" of the conversion event, not just a silent field update.
      try {
        const patientInfo: any = existing.patientId;
        await this.auditLogsService.logAction(
          hospitalId,
          userId,
          'PATIENT_ADMITTED',
          'CLINICAL',
          `${patientInfo?.name || 'Patient'} (UHID: ${patientInfo?.uhid || 'N/A'}) admitted from OPD (${existing.opdNumber || 'N/A'}) to ${targetType} (${registrationNumber}).`
        );
      } catch (auditError) {
        console.error('Failed to log admission audit event:', auditError);
      }

      return updated;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;
      console.error('[AppointmentsService.admit] Unexpected error:', error);
      throw new InternalServerErrorException('Failed to admit patient — see server logs for details.');
    }
  }

  /**
   * ✅ DISCHARGE: closes out an IPD or Day Care admission.
   */
  async discharge(id: string, hospitalId: string, userId?: string, dischargeCondition?: string, dischargeAdvice?: string) {
    if (!hospitalId) {
      throw new BadRequestException('No hospital linked to your session. Please log out and back in.');
    }
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid appointment ID.');
    }

    try {
      const existing = await this.appointmentModel.findOne({ _id: id, hospitalId }).populate('patientId', 'name uhid').exec();
      if (!existing) throw new NotFoundException('Appointment not found.');

      if (existing.visitType === 'OPD') {
        throw new BadRequestException('This is an OPD visit — nothing to discharge.');
      }

      const updated = await this.appointmentModel.findByIdAndUpdate(
        id,
        {
          dischargeDate: new Date(),
          dischargeCondition: dischargeCondition || null,
          dischargeAdvice: dischargeAdvice || null,
        },
        { new: true, runValidators: false }
      ).exec();

      try {
        const patientInfo: any = existing.patientId;
        const regNumber = existing.visitType === 'IPD' ? existing.ipdNumber : existing.dayCareNumber;
        await this.auditLogsService.logAction(
          hospitalId,
          userId,
          'PATIENT_DISCHARGED',
          'CLINICAL',
          `${patientInfo?.name || 'Patient'} (UHID: ${patientInfo?.uhid || 'N/A'}) discharged from ${existing.visitType} (${regNumber || 'N/A'}).`
        );
      } catch (auditError) {
        console.error('Failed to log discharge audit event:', auditError);
      }

      return updated;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;
      console.error('[AppointmentsService.discharge] Unexpected error:', error);
      throw new InternalServerErrorException('Failed to discharge patient — see server logs for details.');
    }
  }

  /**
   * ✅ NABH-style register: OPD, IPD, and Day Care are tracked as separate
   * registers in real hospital record-keeping. This returns visits filtered
   * by type, most recent first, for exactly that kind of sectioned view.
   */
  async getRegister(hospitalId: string, visitType: 'OPD' | 'IPD' | 'DAY_CARE') {
    return this.appointmentModel.find({ hospitalId, visitType })
      .populate('patientId', 'name uhid mobile age gender')
      .populate('doctorId', 'name')
      .populate('roomId', 'name')
      .sort({ startTime: -1 })
      .limit(200)
      .exec();
  }

  /**
   * ✅ Upcoming follow-ups across all visit types, so front desk can see who's
   * due for a return visit without digging through individual patient records.
   */
  async getUpcomingFollowUps(hospitalId: string) {
    const today = new Date().toISOString().split('T')[0];
    return this.appointmentModel.find({
      hospitalId,
      nextFollowUpDate: { $ne: null, $exists: true, $gte: today },
    })
      .populate('patientId', 'name uhid mobile')
      .populate('doctorId', 'name')
      .sort({ nextFollowUpDate: 1 })
      .limit(200)
      .exec();
  }

  /**
   * Builds the ticket PDF buffer for a given appointment/visit — shared by the
   * view/print, email, and WhatsApp send paths so they're always identical.
   */
  private async buildTicketBuffer(appointmentId: string, hospitalId: string) {
    const appt = await this.appointmentModel.findOne({ _id: appointmentId, hospitalId })
      .populate('patientId', 'name age gender uhid mobile email')
      .populate('doctorId', 'name')
      .populate('roomId', 'name')
      .exec();

    if (!appt) throw new NotFoundException('Appointment not found.');

    const hospital = await this.hospitalsService.findOne(hospitalId);
    const patient: any = appt.patientId;
    const doctor: any = appt.doctorId;
    const room: any = appt.roomId;

    const visitType = appt.visitType || 'OPD';
    const visitNumber = visitType === 'IPD' ? appt.ipdNumber : visitType === 'DAY_CARE' ? appt.dayCareNumber : appt.opdNumber;

    const pdfBuffer = await this.pdfService.generateVisitTicketPdf({
      hospital: { name: hospital?.name || 'Vaidya Clinic', location: (hospital as any)?.city, contact: (hospital as any)?.phone },
      patient: { name: patient?.name, age: patient?.age, gender: patient?.gender, uhid: patient?.uhid },
      visitType,
      visitNumber: visitNumber || 'PENDING',
      doctorName: doctor?.name,
      treatmentName: appt.treatmentName,
      roomName: room?.name,
      dateTime: new Date(appt.startTime),
    });

    return { pdfBuffer, patient, hospital, visitType, visitNumber };
  }

  async getTicketPdf(appointmentId: string, hospitalId: string) {
    const { pdfBuffer } = await this.buildTicketBuffer(appointmentId, hospitalId);
    return pdfBuffer;
  }

  async sendTicketWhatsapp(appointmentId: string, hospitalId: string) {
    const { pdfBuffer, patient, hospital, visitType, visitNumber } = await this.buildTicketBuffer(appointmentId, hospitalId);
    if (!patient?.mobile) throw new BadRequestException('This patient has no mobile number on file.');
    return this.whatsappService.sendVisitTicketWhatsapp(hospitalId, patient.mobile, pdfBuffer, hospital?.name || 'Vaidya Clinic', visitType, visitNumber);
  }

  async sendTicketEmail(appointmentId: string, hospitalId: string, targetEmail: string) {
    if (!targetEmail) throw new BadRequestException('Email address is required.');

    const { pdfBuffer, patient, hospital, visitType, visitNumber } = await this.buildTicketBuffer(appointmentId, hospitalId);
    const smtp: any = (hospital as any)?.smtpConfig;

    if (!smtp?.host || !smtp?.user || !smtp?.pass) {
      throw new BadRequestException(
        'This clinic has not configured its own email (SMTP) settings yet. Add them under Clinic Settings before sending tickets by email.'
      );
    }

    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port || 587,
      auth: { user: smtp.user, pass: smtp.pass },
    });

    const typeLabel = visitType === 'DAY_CARE' ? 'Day Care' : visitType;
    const clinicName = hospital?.name || 'Vaidya Clinic';

    await transporter.sendMail({
      from: `"${smtp.fromName || clinicName}" <${smtp.fromEmail || smtp.user}>`,
      to: targetEmail,
      subject: `Your ${typeLabel} Ticket — ${clinicName} (${visitNumber})`,
      text: `Dear ${patient?.name},\n\nPlease find attached your ${typeLabel} registration ticket from ${clinicName}.\n\nVisit Number: ${visitNumber}\n\nPlease keep this for your records and bring it for follow-up visits.\n\nRegards,\n${clinicName}`,
      attachments: [{ filename: `${typeLabel}_Ticket.pdf`, content: pdfBuffer }],
    });

    return { message: 'Ticket emailed successfully.' };
  }
}