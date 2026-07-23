import { TherapiesService } from './therapies.service';
export declare class TherapiesController {
    private readonly therapiesService;
    constructor(therapiesService: TherapiesService);
    create(createDto: any, req: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/therapy.schema").TherapyDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/therapy.schema").Therapy & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getTodayTherapies(req: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/therapy.schema").TherapyDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/therapy.schema").Therapy & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    updateStatus(id: string, status: string, req: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/therapy.schema").TherapyDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/therapy.schema").Therapy & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getTherapyHistory(req: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/therapy.schema").TherapyDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/therapy.schema").Therapy & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getPatientTherapies(patientId: string, req: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/therapy.schema").TherapyDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/therapy.schema").Therapy & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getAllTherapies(req: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/therapy.schema").TherapyDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/therapy.schema").Therapy & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
}
