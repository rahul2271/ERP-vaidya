export declare class CreatePatientDto {
    uhid?: string;
    name: string;
    age: number;
    gender: string;
    mobile: string;
    address?: string;
    assignedDoctorId?: string;
    hospitalId?: string;
    prakriti?: string;
    medicalHistory?: string[];
    chiefComplaints?: string;
    diagnosis?: string;
}
