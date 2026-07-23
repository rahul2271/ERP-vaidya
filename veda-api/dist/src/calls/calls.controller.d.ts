import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { Types } from 'mongoose';
export declare class CallsController {
    private readonly auditLogsService;
    private readonly logger;
    constructor(auditLogsService: AuditLogsService);
    getToken(req: any): Promise<{
        token: string;
    }>;
    bridgeCall(body: any, res: any): Promise<void>;
    handleRecording(body: any, telecallerId: string, hospitalId: string): Promise<{
        success: boolean;
    }>;
    getCallHistory(phone: string, req: any): Promise<(import("mongoose").Document<unknown, {}, import("../audit-logs/schemas/audit-log.schema").AuditLogDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../audit-logs/schemas/audit-log.schema").AuditLog & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getAllHospitalRecordings(req: any): Promise<(import("mongoose").Document<unknown, {}, import("../audit-logs/schemas/audit-log.schema").AuditLogDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../audit-logs/schemas/audit-log.schema").AuditLog & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
}
