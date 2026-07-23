import { Model } from 'mongoose';
import { Report, ReportDocument } from './schemas/report.schema';
export declare class ReportsService {
    private reportModel;
    constructor(reportModel: Model<ReportDocument>);
    getPendingForDoctor(hospitalId: string): Promise<(import("mongoose").Document<unknown, {}, ReportDocument, {}, import("mongoose").DefaultSchemaOptions> & Report & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    markAsReviewed(id: string): Promise<(import("mongoose").Document<unknown, {}, ReportDocument, {}, import("mongoose").DefaultSchemaOptions> & Report & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
}
