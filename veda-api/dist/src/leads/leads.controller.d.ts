import { LeadsService } from './leads.service';
export declare class LeadsController {
    private readonly leadsService;
    constructor(leadsService: LeadsService);
    bulkUpload(body: {
        leads: any[];
    }, req: any): Promise<(Omit<import("mongoose").Document<unknown, {}, import("./schemas/lead.schema").LeadDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/lead.schema").Lead & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, string | number | symbol> & Omit<any, "_id">)[]>;
    getAllForAdmin(req: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/lead.schema").LeadDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/lead.schema").Lead & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getMyLeads(req: any): Promise<{
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
    assignToTelecaller(id: string, body: {
        telecallerId: string;
    }): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/lead.schema").LeadDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/lead.schema").Lead & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    updateStatus(id: string, body: {
        status: string;
        notes: string;
    }): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/lead.schema").LeadDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/lead.schema").Lead & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
}
