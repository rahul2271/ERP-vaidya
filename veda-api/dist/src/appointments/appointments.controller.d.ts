import type { Response } from 'express';
import { AppointmentsService } from './appointments.service';
export declare class AppointmentsController {
    private readonly appointmentsService;
    constructor(appointmentsService: AppointmentsService);
    create(createAppointmentDto: any, req: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/appointment.schema").AppointmentDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/appointment.schema").Appointment & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    scheduleSevenDays(baseData: any, req: any): Promise<import("./schemas/appointment.schema").Appointment[]>;
    findAll(req: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/appointment.schema").AppointmentDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/appointment.schema").Appointment & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getDailyRevenue(req: any, date: string): Promise<{
        date: string;
        completedSessions: number;
        totalRevenue: string;
    }>;
    getRegister(visitType: 'OPD' | 'IPD' | 'DAY_CARE', req: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/appointment.schema").AppointmentDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/appointment.schema").Appointment & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getUpcomingFollowUps(req: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/appointment.schema").AppointmentDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/appointment.schema").Appointment & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getPatientHistory(patientId: string, req: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/appointment.schema").AppointmentDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/appointment.schema").Appointment & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getBilling(id: string): Promise<{
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
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/appointment.schema").AppointmentDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/appointment.schema").Appointment & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    update(id: string, data: any, req: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/appointment.schema").AppointmentDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/appointment.schema").Appointment & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    updateVitals(id: string, vitalsData: any, req: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/appointment.schema").AppointmentDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/appointment.schema").Appointment & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    admitPatient(id: string, targetType: 'IPD' | 'DAY_CARE', req: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/appointment.schema").AppointmentDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/appointment.schema").Appointment & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    dischargePatient(id: string, dischargeCondition: string, dischargeAdvice: string, req: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/appointment.schema").AppointmentDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/appointment.schema").Appointment & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    getTicket(id: string, req: any, res: Response): Promise<void>;
    sendTicketWhatsapp(id: string, req: any): Promise<{
        success: boolean;
    }>;
    sendTicketEmail(id: string, email: string, req: any): Promise<{
        message: string;
    }>;
    processRecommendation(body: {
        originalApptId: string;
        therapyId: string;
        action: 'BOOK' | 'DISCARD';
        patientId: string;
        treatmentName: string;
    }): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/appointment.schema").AppointmentDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/appointment.schema").Appointment & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | {
        message: string;
    }>;
    getByDay(date: string, req: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/appointment.schema").AppointmentDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/appointment.schema").Appointment & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getDashboardAnalytics(req: any): Promise<{
        stats: {
            todayPatients: number;
            todayRevenue: number;
            upcomingAppts: number;
            monthlyGrowth: number;
        };
        revenueTrend: unknown[];
        topDoctors: any[];
        topTherapies: {
            name: any;
            percent: number;
        }[];
    }>;
}
