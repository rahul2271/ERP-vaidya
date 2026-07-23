import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Patient, PatientDocument } from './schemas/patient.schema';
import { Appointment } from '../appointments/schemas/appointment.schema';
import { CounterService } from '../common/counter.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

@Injectable()
export class PatientsService {
  constructor(
    @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
    @InjectModel(Patient.name) private patientModel: Model<PatientDocument>,
    private readonly counterService: CounterService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  // 🚀 SEQUENTIAL UHID GENERATOR
  // Was previously Math.random() — a collision risk that gets worse as patient
  // volume grows, and not how real hospital UHIDs work (they're sequential and
  // traceable). Now backed by an atomic per-hospital counter.
  private async generateUHID(hospitalId: string, hospitalName: string): Promise<string> {
    const words = (hospitalName || "Vaidya Clinic").trim().split(/\s+/);
    let initials = "VDA";

    if (words.length > 1) {
      initials = words.map(w => w[0]).join('').substring(0, 3).toUpperCase();
    } else if (words.length === 1 && words[0].length >= 3) {
      initials = words[0].substring(0, 3).toUpperCase();
    }

    return this.counterService.generateNumber(hospitalId, 'UHID', initials);
  }

  /**
   * 1. CREATE PATIENT
   */
  async create(createDto: any, user: any) {
    const hospitalId = user.hospitalId;
    
    if (!hospitalId) {
      throw new BadRequestException('Critical Error: Hospital ID missing from user session.');
    }

    const hospital = await this.patientModel.db.model('Hospital').findById(hospitalId);
    const hospitalName = hospital ? hospital['name'] : 'Vaidya Clinic';

    if (createDto.mobile) {
      const existingPatient = await this.patientModel.findOne({ 
        mobile: createDto.mobile, 
        hospitalId: hospitalId 
      });
      
      if (existingPatient) {
        console.log(`[CRM] Patient with mobile ${createDto.mobile} already exists.`);
        let needsSave = false;

        if (!existingPatient.uhid) {
            existingPatient.uhid = createDto.uhid || await this.generateUHID(hospitalId, hospitalName);
            needsSave = true;
        }

        if (createDto.assignedDoctorId && !existingPatient.assignedDoctorId) {
            existingPatient.assignedDoctorId = createDto.assignedDoctorId;
            needsSave = true;
        }

        if (needsSave) await existingPatient.save();
        return existingPatient; 
      }
    }

    const doctorId = user.role?.toUpperCase() === 'DOCTOR' 
      ? user.userId 
      : (createDto.assignedDoctorId || null);

    const newPatient = new this.patientModel({
      ...createDto,
      uhid: createDto.uhid || await this.generateUHID(hospitalId, hospitalName), 
      hospitalId: hospitalId, 
      assignedDoctorId: doctorId, 
    });

    return await newPatient.save();
  }

  /**
   * 2. FIND BY DOCTOR
   */
  async findByDoctor(hospitalId: string, doctorId: string) {
    return this.patientModel.find({ 
      hospitalId: hospitalId, 
      assignedDoctorId: doctorId 
    }).sort({ createdAt: -1 }).exec();
  }

  /**
   * 3. FIND ALL (Admin View - Secured by Hospital)
   */
  async findAll(hospitalId?: string) {
    const filter = hospitalId ? { hospitalId } : {};
    return this.patientModel.find(filter)
      .populate('hospitalId')
      .sort({ createdAt: -1 })
      .exec();
  }

  /**
   * 4. FIND ONE
   */
  async findOne(id: string) {
    const patient = await this.patientModel.findById(id)
      .populate('hospitalId') 
      .populate('assignedDoctorId', 'name email')
      .exec();
    
    if (!patient) throw new NotFoundException(`Patient #${id} not found`);
    return patient;
  }

  /**
   * 5. UPDATE
   */
  async update(id: string, updatePatientDto: any) {
    const patient = await this.patientModel.findById(id).populate('hospitalId').exec();
    if (!patient) throw new NotFoundException('Patient not found');

    if (!patient.uhid && !updatePatientDto.uhid) {
        const hospitalDoc: any = patient.hospitalId;
        const hospitalName = hospitalDoc?.name || 'Vaidya Clinic';
        const hospitalId = hospitalDoc?._id?.toString() || hospitalDoc?.toString();
        updatePatientDto.uhid = await this.generateUHID(hospitalId, hospitalName);
    }

    return this.patientModel.findByIdAndUpdate(id, updatePatientDto, { new: true }).exec();
  }

  /**
   * 6. REMOVE
   */
  async remove(id: string) {
    return this.patientModel.findByIdAndDelete(id).exec();
  }

  /**
   * 7. GET TREATMENT HISTORY
   */
  async getTreatmentHistory(patientId: string) {
    return this.appointmentModel.find({ patientId })
      .populate('therapistId', 'name')
      .populate('roomId', 'name')
      .select('+chiefComplaints +diagnosis')
      .sort({ startTime: -1 }) 
      .exec();
  }

  /**
   * 8. GET DISCHARGE SUMMARY
   */
  async getDischargeSummary(patientId: string) {
    const patient = await this.patientModel.findById(patientId)
      .populate('hospitalId')
      .populate('assignedDoctorId', 'name') 
      .exec();
      
    if (!patient) throw new NotFoundException('Patient not found');

    const appointments = await this.appointmentModel.find({ 
      patientId: patientId,
      status: { $in: ['COMPLETED', 'IN_PROGRESS', 'SCHEDULED'] }
    })
    .select('+chiefComplaints +diagnosis') 
    .populate('therapistId', 'name')
    .populate('doctorId', 'name') 
    .populate('medicinesUsed.inventoryId', 'name')
    .sort({ startTime: 1 })
    .exec();

    const treatments = appointments.map(app => {
      return {
        date: app.startTime,
        treatment: app.treatmentName,
        status: app.status,
        amount: app.amount || 0,
        vitals: app.vitals || { preBp: '---', postBp: '---', pulse: 'N/A' }, 
        chiefComplaints: app.chiefComplaints || "", 
        diagnosis: app.diagnosis || "",             
        medicinesUsed: app.medicinesUsed?.map((m: any) => ({
          name: m.inventoryId?.name || 'Ayurvedic Product',
          quantity: m.quantity,
          unit: m.inventoryId?.unit || 'Units'
        })) || [],
        
        // 🚀 THE FIX: NO MORE HARDCODED "Dr." PREFIXES!
        therapist: (app.therapistId as any)?.name || 'Staff',
        doctor: (app as any).doctorId?.name || null 
      };
    });

    let totalBilled = 0;
    let amountPaid = 0;
    appointments.forEach(app => {
        totalBilled += (app.amount || 0);
        if (app.paymentStatus === 'PAID') amountPaid += (app.amount || 0);
    });

    const hospital = patient.hospitalId as any;
    const hospitalLocation = [hospital?.address, hospital?.city, hospital?.state].filter(Boolean).join(", ") || "Mohali, Punjab";

    // ✅ NABH-required registration/visit info: the most recent visit gives us
    // visit type + registration number + admission/discharge/follow-up dates.
    // If an OPD visit was later admitted to IPD/Day Care, that same record
    // still carries the original OPD number too, so both are always visible.
    const latestVisit = appointments[appointments.length - 1];
    const visitType = latestVisit?.visitType || 'OPD';
    const visitNumber = visitType === 'IPD' ? latestVisit?.ipdNumber
      : visitType === 'DAY_CARE' ? latestVisit?.dayCareNumber
      : latestVisit?.opdNumber;

    // ✅ Conversion history: every OPD→IPD/Day Care admission and discharge
    // event for this patient, pulled from the audit trail so the final
    // discharge summary shows the full episode of care, not just the latest state.
    let conversionHistory: any[] = [];
    try {
      const logs = await this.auditLogsService.findAll({
        hospitalId: patient.hospitalId,
        action: { $in: ['PATIENT_ADMITTED', 'PATIENT_DISCHARGED'] },
        details: { $regex: patient.uhid ? patient.uhid.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : patient._id.toString() },
      });
      conversionHistory = logs.map((l: any) => ({
        action: l.action,
        details: l.details,
        timestamp: l.createdAt,
      }));
    } catch (error) {
      console.error('Failed to fetch conversion history for discharge summary:', error);
    }

    return {
      reportDate: new Date().toISOString().split('T')[0],
      hospitalDetails: {
        name: hospital?.name || 'Vaidya Medical Center',
        logo: hospital?.logo || "",
        tagline: hospital?.tagline || "",
        location: hospitalLocation,
        contact: hospital?.phone || 'N/A',
        gstNumber: hospital?.gstNumber || "",
        registrationNumber: hospital?.registrationNumber || ""
      },
      patientProfile: {
        _id: patient._id, 
        id: patient._id.toString(), 
        uhid: patient.uhid, 
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        mobile: patient.mobile,
        address: patient.address,
        prakritiScores: patient.prakritiScores, // 🚀 ADD THIS LINE!
        chiefComplaints: patient.chiefComplaints || "",
        diagnosis: patient.diagnosis || "",
        medicalHistory: patient.medicalHistory || [],
        
        // 🚀 THE FIX: JUST SEND THE RAW NAME
        assignedDoctor: (patient.assignedDoctorId as any)?.name || null 
      },
      // ✅ NABH filing details for this episode of care
      registrationDetails: {
        visitType,
        visitNumber: visitNumber || 'N/A',
        opdNumber: latestVisit?.opdNumber || null,
        ipdNumber: latestVisit?.ipdNumber || null,
        dayCareNumber: latestVisit?.dayCareNumber || null,
        admissionDate: latestVisit?.admissionDate || null,
        dischargeDate: latestVisit?.dischargeDate || null,
        dischargeCondition: latestVisit?.dischargeCondition || null,
        dischargeAdvice: latestVisit?.dischargeAdvice || null,
        nextFollowUpDate: latestVisit?.nextFollowUpDate || null,
      },
      conversionHistory,
      clinicalSummary: {
        totalTreatments: treatments.length,
        treatments: treatments 
      },
      financialSummary: {
        finalAmount: totalBilled,
        subtotal: totalBilled, 
        totalAmountDue: totalBilled - amountPaid,
        paymentStatus: (totalBilled > 0 && amountPaid >= totalBilled) ? 'PAID' : 'PENDING'
      }
    };
  }

  // ==================================================================
  // 🚀 9. DIGITAL PRAKRITI ASSESSMENT LOGIC
  // ==================================================================

  // Generate a secure, unique token for the patient's WhatsApp link
  async generatePrakritiToken(patientId: string) {
    const token = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
    
    const patient = await this.patientModel.findByIdAndUpdate(
      patientId, 
      { prakritiToken: token }, 
      { new: true }
    ).exec();

    if (!patient) throw new NotFoundException('Patient not found');
    return patient;
  }

  // Validate the token when the patient clicks the link (Public Route)
  async validatePrakritiToken(token: string) {
    const patient = await this.patientModel.findOne({ prakritiToken: token })
      .populate('hospitalId', 'name logo') // Send clinic name/logo to the public UI
      .exec();
      
    if (!patient) throw new NotFoundException('Assessment link is invalid or has expired.');
    
    // Only return safe, non-sensitive data to the public internet!
    return {
      name: patient.name,
      hospital: patient.hospitalId,
    };
  }

  // Save the final calculated scores and destroy the token (Public Route)
  async savePrakritiScores(token: string, scores: { vata: number, pitta: number, kapha: number }) {
    const patient = await this.patientModel.findOneAndUpdate(
      { prakritiToken: token },
      { 
        prakritiScores: scores,
        prakritiToken: null // 🚀 Destroy token so they can't submit twice!
      },
      { new: true }
    ).exec();

    if (!patient) throw new NotFoundException('Invalid or expired link.');
    return { success: true, message: 'Prakriti Profile Updated!' };
  }
}