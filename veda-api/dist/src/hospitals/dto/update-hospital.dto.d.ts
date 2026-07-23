import { CreateHospitalDto } from './create-hospital.dto';
declare const UpdateHospitalDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateHospitalDto>>;
export declare class UpdateHospitalDto extends UpdateHospitalDto_base {
    whatsappConfig?: {
        accessToken?: string;
        phoneId?: string;
        businessAccountId?: string;
        verifyToken?: string;
    };
    plan?: string;
    status?: string;
}
export {};
