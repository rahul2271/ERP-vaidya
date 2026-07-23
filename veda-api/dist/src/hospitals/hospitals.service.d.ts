import { Model } from 'mongoose';
import { Hospital } from './schemas/hospital.schema';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';
export declare class HospitalsService {
    private hospitalModel;
    constructor(hospitalModel: Model<Hospital>);
    create(createHospitalDto: CreateHospitalDto): Promise<import("mongoose").Document<unknown, {}, Hospital, {}, import("mongoose").DefaultSchemaOptions> & Hospital & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, Hospital, {}, import("mongoose").DefaultSchemaOptions> & Hospital & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, Hospital, {}, import("mongoose").DefaultSchemaOptions> & Hospital & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    update(id: string, updateHospitalDto: UpdateHospitalDto): Promise<import("mongoose").Document<unknown, {}, Hospital, {}, import("mongoose").DefaultSchemaOptions> & Hospital & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    updateWhatsAppConfig(hospitalId: string, accessToken: string, phoneId: string): Promise<import("mongoose").Document<unknown, {}, Hospital, {}, import("mongoose").DefaultSchemaOptions> & Hospital & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    updatePlan(id: string, plan: string): Promise<import("mongoose").Document<unknown, {}, Hospital, {}, import("mongoose").DefaultSchemaOptions> & Hospital & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    activatePaidPlan(id: string, plan: string, billingCycle?: 'monthly' | 'annually'): Promise<import("mongoose").Document<unknown, {}, Hospital, {}, import("mongoose").DefaultSchemaOptions> & Hospital & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    remove(id: string): Promise<import("mongoose").Document<unknown, {}, Hospital, {}, import("mongoose").DefaultSchemaOptions> & Hospital & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    getEffectiveStatus(hospitalId: string): Promise<{
        subscriptionStatus: string;
        plan: string;
        trialEndsAt: Date;
        planRenewsAt: Date;
        daysLeft: number;
        isBlocked: boolean;
    }>;
}
