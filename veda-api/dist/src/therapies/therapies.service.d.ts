import { Model } from 'mongoose';
import { Therapy, TherapyDocument } from './schemas/therapy.schema';
export declare class TherapiesService {
    private therapyModel;
    constructor(therapyModel: Model<TherapyDocument>);
    create(createDto: any): Promise<import("mongoose").Document<unknown, {}, TherapyDocument, {}, import("mongoose").DefaultSchemaOptions> & Therapy & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getTodayTherapiesForTherapist(therapistId: string, hospitalId: string): Promise<(import("mongoose").Document<unknown, {}, TherapyDocument, {}, import("mongoose").DefaultSchemaOptions> & Therapy & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    updateStatus(id: string, status: string, hospitalId: string): Promise<import("mongoose").Document<unknown, {}, TherapyDocument, {}, import("mongoose").DefaultSchemaOptions> & Therapy & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getTherapyHistoryForTherapist(therapistId: string, hospitalId: string): Promise<(import("mongoose").Document<unknown, {}, TherapyDocument, {}, import("mongoose").DefaultSchemaOptions> & Therapy & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getTherapiesByPatient(patientId: string, hospitalId: string): Promise<(import("mongoose").Document<unknown, {}, TherapyDocument, {}, import("mongoose").DefaultSchemaOptions> & Therapy & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getAllTherapiesForHospital(hospitalId: string): Promise<(import("mongoose").Document<unknown, {}, TherapyDocument, {}, import("mongoose").DefaultSchemaOptions> & Therapy & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
}
