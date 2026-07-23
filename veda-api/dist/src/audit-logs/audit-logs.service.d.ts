import { Model } from 'mongoose';
import { AuditLog, AuditLogDocument } from './schemas/audit-log.schema';
export declare class AuditLogsService {
    private auditLogModel;
    private hospitalModel;
    private readonly logger;
    constructor(auditLogModel: Model<AuditLogDocument>, hospitalModel: Model<any>);
    create(logData: Partial<AuditLog>): Promise<AuditLogDocument | null>;
    findAll(query?: any): Promise<(import("mongoose").Document<unknown, {}, AuditLogDocument, {}, import("mongoose").DefaultSchemaOptions> & AuditLog & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    logAction(hospitalId: any, userId: any, action: string, module: string, details: string): Promise<import("mongoose").Document<unknown, {}, AuditLogDocument, {}, import("mongoose").DefaultSchemaOptions> & AuditLog & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAllForHospital(hospitalId: string): Promise<(import("mongoose").Document<unknown, {}, AuditLogDocument, {}, import("mongoose").DefaultSchemaOptions> & AuditLog & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
}
