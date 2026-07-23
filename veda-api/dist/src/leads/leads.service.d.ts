import { Model } from 'mongoose';
import { Lead, LeadDocument } from './schemas/lead.schema';
import { WhatsAppMessage } from '../whatsapp/schemas/whatsapp-message.schema';
export declare class LeadsService {
    private leadModel;
    private waModel;
    constructor(leadModel: Model<LeadDocument>, waModel: Model<WhatsAppMessage>);
    bulkCreateLeads(leads: any[], hospitalId: string): Promise<(Omit<import("mongoose").Document<unknown, {}, LeadDocument, {}, import("mongoose").DefaultSchemaOptions> & Lead & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, string | number | symbol> & Omit<any, "_id">)[]>;
    getAllLeads(hospitalId: string): Promise<(import("mongoose").Document<unknown, {}, LeadDocument, {}, import("mongoose").DefaultSchemaOptions> & Lead & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    assignLead(leadId: string, telecallerId: string): Promise<(import("mongoose").Document<unknown, {}, LeadDocument, {}, import("mongoose").DefaultSchemaOptions> & Lead & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    getMyLeads(telecallerId: string): Promise<{
        unreadCount: number;
        hospitalId: import("mongoose").Types.ObjectId;
        patientName: string;
        phone: string;
        source: string;
        status: string;
        assignedTo: import("mongoose").Types.ObjectId;
        medicalHistoryNotes: string;
        convertedPatientId: import("mongoose").Types.ObjectId;
        preferredDoctor: string;
        problem: string;
        city: string;
        _id: import("mongoose").Types.ObjectId;
        $locals: Record<string, unknown>;
        $op: "save" | "validate" | "remove" | null;
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: import("mongoose").Collection;
        db: import("mongoose").Connection;
        errors?: import("mongoose").Error.ValidationError;
        isNew: boolean;
        schema: import("mongoose").Schema;
        __v: number;
    }[]>;
    updateLeadStatus(leadId: string, status: string, notes: string): Promise<(import("mongoose").Document<unknown, {}, LeadDocument, {}, import("mongoose").DefaultSchemaOptions> & Lead & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
}
