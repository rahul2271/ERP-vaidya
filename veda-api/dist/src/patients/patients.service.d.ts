import { Model } from 'mongoose';
import { Patient, PatientDocument } from './schemas/patient.schema';
import { Appointment } from '../appointments/schemas/appointment.schema';
import { CounterService } from '../common/counter.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
export declare class PatientsService {
    private appointmentModel;
    private patientModel;
    private readonly counterService;
    private readonly auditLogsService;
    constructor(appointmentModel: Model<Appointment>, patientModel: Model<PatientDocument>, counterService: CounterService, auditLogsService: AuditLogsService);
    private generateUHID;
    create(createDto: any, user: any): Promise<import("mongoose").Document<unknown, {}, PatientDocument, {}, import("mongoose").DefaultSchemaOptions> & Patient & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findByDoctor(hospitalId: string, doctorId: string): Promise<(import("mongoose").Document<unknown, {}, PatientDocument, {}, import("mongoose").DefaultSchemaOptions> & Patient & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findAll(hospitalId?: string): Promise<(import("mongoose").Document<unknown, {}, PatientDocument, {}, import("mongoose").DefaultSchemaOptions> & Patient & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, PatientDocument, {}, import("mongoose").DefaultSchemaOptions> & Patient & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    update(id: string, updatePatientDto: any): Promise<(import("mongoose").Document<unknown, {}, PatientDocument, {}, import("mongoose").DefaultSchemaOptions> & Patient & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    remove(id: string): Promise<(import("mongoose").Document<unknown, {}, PatientDocument, {}, import("mongoose").DefaultSchemaOptions> & Patient & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    getTreatmentHistory(patientId: string): Promise<(import("mongoose").Document<unknown, {}, Appointment, {}, import("mongoose").DefaultSchemaOptions> & Appointment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getDischargeSummary(patientId: string): Promise<{
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
    generatePrakritiToken(patientId: string): Promise<import("mongoose").Document<unknown, {}, PatientDocument, {}, import("mongoose").DefaultSchemaOptions> & Patient & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    validatePrakritiToken(token: string): Promise<{
        name: string;
        hospital: import("../hospitals/schemas/hospital.schema").Hospital | import("mongoose").Types.ObjectId;
    }>;
    savePrakritiScores(token: string, scores: {
        vata: number;
        pitta: number;
        kapha: number;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
}
