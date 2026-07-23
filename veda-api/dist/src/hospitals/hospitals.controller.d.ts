import { HospitalsService } from './hospitals.service';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';
export declare class HospitalsController {
    private readonly hospitalsService;
    constructor(hospitalsService: HospitalsService);
    getMyClinic(req: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/hospital.schema").Hospital, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/hospital.schema").Hospital & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    updateMyClinic(req: any, body: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/hospital.schema").Hospital, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/hospital.schema").Hospital & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    getMyPlan(req: any): Promise<{
        subscriptionStatus: string;
        plan: string;
        trialEndsAt: Date;
        planRenewsAt: Date;
        daysLeft: number;
        isBlocked: boolean;
    } | {
        plan: string;
        subscriptionStatus: string;
        isBlocked: boolean;
        daysLeft: number;
    }>;
    updateWhatsAppConfigSuperAdmin(id: string, config: {
        accessToken: string;
        phoneId: string;
        businessAccountId?: string;
        verifyToken?: string;
    }): Promise<import("mongoose").Document<unknown, {}, import("./schemas/hospital.schema").Hospital, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/hospital.schema").Hospital & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    create(createHospitalDto: CreateHospitalDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/hospital.schema").Hospital, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/hospital.schema").Hospital & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/hospital.schema").Hospital, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/hospital.schema").Hospital & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/hospital.schema").Hospital, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/hospital.schema").Hospital & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    update(id: string, updateHospitalDto: UpdateHospitalDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/hospital.schema").Hospital, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/hospital.schema").Hospital & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    remove(id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/hospital.schema").Hospital, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/hospital.schema").Hospital & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
}
