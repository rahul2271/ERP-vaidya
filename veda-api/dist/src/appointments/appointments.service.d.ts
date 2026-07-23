import { Model, Types } from 'mongoose';
import { Appointment, AppointmentDocument } from './schemas/appointment.schema';
import { TreatmentDocument } from '../treatments/schemas/treatment.schema';
import { CounterService } from '../common/counter.service';
import { HospitalsService } from '../hospitals/hospitals.service';
import { PdfService } from '../patients/pdf.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { WhatsAppService } from '../whatsapp/whatsapp.service';
export declare class AppointmentsService {
    private appointmentModel;
    private treatmentModel;
    private readonly whatsappService;
    private readonly counterService;
    private readonly hospitalsService;
    private readonly pdfService;
    private readonly auditLogsService;
    constructor(appointmentModel: Model<AppointmentDocument>, treatmentModel: Model<TreatmentDocument>, whatsappService: WhatsAppService, counterService: CounterService, hospitalsService: HospitalsService, pdfService: PdfService, auditLogsService: AuditLogsService);
    create(createDto: any, user?: any): Promise<import("mongoose").Document<unknown, {}, AppointmentDocument, {}, import("mongoose").DefaultSchemaOptions> & Appointment & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    scheduleSevenDays(baseData: any, user?: any): Promise<Appointment[]>;
    recordVitals(id: string, vitalsData: any, user: any): Promise<(import("mongoose").Document<unknown, {}, AppointmentDocument, {}, import("mongoose").DefaultSchemaOptions> & Appointment & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    update(id: string, data: any, user: any): Promise<(import("mongoose").Document<unknown, {}, AppointmentDocument, {}, import("mongoose").DefaultSchemaOptions> & Appointment & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    getPatientBillingSummary(patientId: string): Promise<{
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
    getDailyRevenue(hospitalId: string, date: string): Promise<{
        date: string;
        completedSessions: number;
        totalRevenue: string;
    }>;
    findDoctorAppointments(hospitalId: string, doctorId: string): Promise<(import("mongoose").Document<unknown, {}, AppointmentDocument, {}, import("mongoose").DefaultSchemaOptions> & Appointment & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findAll(hospitalId?: string): Promise<(import("mongoose").Document<unknown, {}, AppointmentDocument, {}, import("mongoose").DefaultSchemaOptions> & Appointment & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findByPatient(patientId: string): Promise<(import("mongoose").Document<unknown, {}, AppointmentDocument, {}, import("mongoose").DefaultSchemaOptions> & Appointment & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, AppointmentDocument, {}, import("mongoose").DefaultSchemaOptions> & Appointment & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    cleanupPlaceholderRecords(): Promise<{
        message: string;
        deletedCount: number;
    }>;
    handleRecommendation(data: any): Promise<(import("mongoose").Document<unknown, {}, AppointmentDocument, {}, import("mongoose").DefaultSchemaOptions> & Appointment & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | {
        message: string;
    }>;
    getAppointmentsByPatient(patientId: string, hospitalId: string): Promise<(import("mongoose").Document<unknown, {}, AppointmentDocument, {}, import("mongoose").DefaultSchemaOptions> & Appointment & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getTodayAppointments(hospitalId: string): Promise<(import("mongoose").Document<unknown, {}, AppointmentDocument, {}, import("mongoose").DefaultSchemaOptions> & Appointment & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getDoctorDashboardQueue(hospitalId: string, dateStr: string): Promise<(import("mongoose").Document<unknown, {}, AppointmentDocument, {}, import("mongoose").DefaultSchemaOptions> & Appointment & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    admit(id: string, targetType: 'IPD' | 'DAY_CARE', hospitalId: string, userId?: string): Promise<(import("mongoose").Document<unknown, {}, AppointmentDocument, {}, import("mongoose").DefaultSchemaOptions> & Appointment & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    discharge(id: string, hospitalId: string, userId?: string, dischargeCondition?: string, dischargeAdvice?: string): Promise<(import("mongoose").Document<unknown, {}, AppointmentDocument, {}, import("mongoose").DefaultSchemaOptions> & Appointment & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    getRegister(hospitalId: string, visitType: 'OPD' | 'IPD' | 'DAY_CARE'): Promise<(import("mongoose").Document<unknown, {}, AppointmentDocument, {}, import("mongoose").DefaultSchemaOptions> & Appointment & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getUpcomingFollowUps(hospitalId: string): Promise<(import("mongoose").Document<unknown, {}, AppointmentDocument, {}, import("mongoose").DefaultSchemaOptions> & Appointment & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    private buildTicketBuffer;
    getTicketPdf(appointmentId: string, hospitalId: string): Promise<Buffer<ArrayBufferLike>>;
    sendTicketWhatsapp(appointmentId: string, hospitalId: string): Promise<{
        success: boolean;
    }>;
    sendTicketEmail(appointmentId: string, hospitalId: string, targetEmail: string): Promise<{
        message: string;
    }>;
}
