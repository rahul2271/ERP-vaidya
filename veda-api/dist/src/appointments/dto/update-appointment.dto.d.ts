import { CreateAppointmentDto } from './create-appointment.dto';
declare class MedicineUsedDto {
    inventoryId: string;
    quantity: number;
    priceAtTime?: number;
}
declare class RecommendedTherapyDto {
    treatmentName: string;
    notes?: string;
    isProcessed?: boolean;
}
declare const UpdateAppointmentDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateAppointmentDto>>;
export declare class UpdateAppointmentDto extends UpdateAppointmentDto_base {
    status?: string;
    vitals?: any;
    medicinesUsed?: MedicineUsedDto[];
    chiefComplaints?: string;
    diagnosis?: string;
    nextFollowUpDate?: string;
    recommendedTherapies?: RecommendedTherapyDto[];
}
export {};
