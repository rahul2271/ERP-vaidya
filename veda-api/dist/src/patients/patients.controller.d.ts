import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { AppointmentsService } from '../appointments/appointments.service';
import { PdfService } from './pdf.service';
import { WhatsAppService } from '../whatsapp/whatsapp.service';
import { HospitalsService } from '../hospitals/hospitals.service';
import type { Response } from 'express';
export declare class SubmitPrakritiDto {
    vata: number;
    pitta: number;
    kapha: number;
}
export declare class PatientsController {
    private readonly patientsService;
    private readonly appointmentsService;
    private readonly pdfService;
    private readonly whatsappService;
    private readonly hospitalsService;
    constructor(patientsService: PatientsService, appointmentsService: AppointmentsService, pdfService: PdfService, whatsappService: WhatsAppService, hospitalsService: HospitalsService);
    create(createPatientDto: CreatePatientDto, req: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/patient.schema").PatientDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/patient.schema").Patient & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getMyPatients(req: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/patient.schema").PatientDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/patient.schema").Patient & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findAll(req: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/patient.schema").PatientDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/patient.schema").Patient & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getDischargeSummary(id: string): Promise<{
        reportDate: string;
        hospitalDetails: {
            name: any;
            logo: any;
            tagline: any;
            location: string;
            contact: any;
            gstNumber: any;
            registrationNumber: any;
        };
        patientProfile: {
            _id: import("mongoose").Types.ObjectId;
            id: string;
            uhid: string | undefined;
            name: string;
            age: number;
            gender: string;
            mobile: string;
            address: string;
            prakritiScores: {
                vata: number;
                pitta: number;
                kapha: number;
            } | undefined;
            chiefComplaints: string;
            diagnosis: string;
            medicalHistory: string[];
            assignedDoctor: any;
        };
        registrationDetails: {
            visitType: string;
            visitNumber: string;
            opdNumber: string | null;
            ipdNumber: string | null;
            dayCareNumber: string | null;
            admissionDate: Date;
            dischargeDate: Date;
            dischargeCondition: string | null;
            dischargeAdvice: string | null;
            nextFollowUpDate: string | null;
        };
        conversionHistory: any[];
        clinicalSummary: {
            totalTreatments: number;
            treatments: {
                date: Date;
                treatment: string;
                status: string;
                amount: number;
                vitals: {
                    preBp: string;
                    postBp: string;
                    pulse: string;
                    weight: string;
                    notes: string;
                };
                chiefComplaints: string;
                diagnosis: string;
                medicinesUsed: {
                    name: any;
                    quantity: any;
                    unit: any;
                }[];
                therapist: any;
                doctor: any;
            }[];
        };
        financialSummary: {
            finalAmount: number;
            subtotal: number;
            totalAmountDue: number;
            paymentStatus: string;
        };
    }>;
    downloadDischargePdf(id: string, res: Response): Promise<void>;
    sendBillEmail(id: string, targetEmail: string, req: any): Promise<{
        message: string;
    }>;
    sendWhatsappInvoice(id: string, req: any): Promise<{
        success: boolean;
    }>;
    getPrakritiAssessment(token: string): Promise<{
        name: string;
        hospital: import("../hospitals/schemas/hospital.schema").Hospital | import("mongoose").Types.ObjectId;
    }>;
    submitPrakritiAssessment(token: string, scores: SubmitPrakritiDto): Promise<{
        success: boolean;
        message: string;
    }>;
    sendPrakritiQuiz(id: string, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    getBill(id: string): Promise<{
        patientId: string;
        billDate: Date;
        completedSessions: number;
        sections: {
            therapies: {
                title: string;
                items: {
                    id: string;
                    date: Date;
                    name: string;
                    cost: number;
                }[];
                total: number;
            };
            medicines: {
                title: string;
                items: {
                    date: Date;
                    name: string;
                    qty: number;
                    unitPrice: number;
                    total: number;
                }[];
                total: number;
            };
        };
        subtotal: number;
        totalDiscount: number;
        finalAmount: number;
        amountPaid: number;
        balanceDue: number;
        totalDue: string;
        paymentStatus: string;
        status: string;
    }>;
    getHistory(id: string): Promise<(import("mongoose").Document<unknown, {}, import("../appointments/schemas/appointment.schema").AppointmentDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../appointments/schemas/appointment.schema").Appointment & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/patient.schema").PatientDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/patient.schema").Patient & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    update(id: string, updatePatientDto: UpdatePatientDto): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/patient.schema").PatientDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/patient.schema").Patient & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    remove(id: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/patient.schema").PatientDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/patient.schema").Patient & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
}
