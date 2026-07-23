export class CreateAppointmentDto {
  patientId: string;
  therapistId: string;
  treatmentName: string;
  startTime: string;
  endTime: string;
  
  // ✅ NEW: Add these so you can send them from Postman/Frontend
  amount: number;
  medications?: string[];
}