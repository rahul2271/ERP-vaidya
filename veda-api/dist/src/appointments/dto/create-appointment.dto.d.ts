export declare class CreateAppointmentDto {
    patientId: string;
    therapistId: string;
    treatmentName: string;
    startTime: string;
    endTime: string;
    amount: number;
    medications?: string[];
}
