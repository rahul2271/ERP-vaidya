import { Model, Types } from 'mongoose';
import { Treatment, TreatmentDocument } from './schemas/treatment.schema';
import { UsersService } from '../users/users.service';
export declare class TreatmentsService {
    private treatmentModel;
    private usersService;
    constructor(treatmentModel: Model<TreatmentDocument>, usersService: UsersService);
    create(createDto: any, hospitalId: string): Promise<import("mongoose").Document<unknown, {}, TreatmentDocument, {}, import("mongoose").DefaultSchemaOptions> & Treatment & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(hospitalId: string): Promise<(import("mongoose").Document<unknown, {}, TreatmentDocument, {}, import("mongoose").DefaultSchemaOptions> & Treatment & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    remove(id: string): Promise<(import("mongoose").Document<unknown, {}, TreatmentDocument, {}, import("mongoose").DefaultSchemaOptions> & Treatment & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    startTherapySession(treatmentId: string, therapistId: string, reqUser: any): Promise<(import("mongoose").Document<unknown, {}, TreatmentDocument, {}, import("mongoose").DefaultSchemaOptions> & Treatment & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    completeTherapySession(treatmentId: string, therapistId: string, reqUser: any): Promise<(import("mongoose").Document<unknown, {}, TreatmentDocument, {}, import("mongoose").DefaultSchemaOptions> & Treatment & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
}
