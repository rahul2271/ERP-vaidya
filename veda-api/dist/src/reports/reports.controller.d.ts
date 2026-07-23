import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getPending(req: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/report.schema").ReportDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/report.schema").Report & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    review(id: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/report.schema").ReportDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/report.schema").Report & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
}
