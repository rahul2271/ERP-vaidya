import { TreatmentsService } from './treatments.service';
export declare class TreatmentsController {
    private readonly treatmentsService;
    constructor(treatmentsService: TreatmentsService);
    create(body: any, req: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/treatment.schema").TreatmentDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/treatment.schema").Treatment & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(req: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/treatment.schema").TreatmentDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/treatment.schema").Treatment & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
}
