import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { Patient, PatientSchema } from './schemas/patient.schema';
import { Appointment, AppointmentSchema } from '../appointments/schemas/appointment.schema';
import { AppointmentsModule } from '../appointments/appointments.module';
import { PdfService } from './pdf.service'; 
import { WhatsAppModule } from '../whatsapp/whatsapp.module';
import { HospitalsModule } from '../hospitals/hospitals.module';
import { CommonModule } from '../common/common.module';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Patient.name, schema: PatientSchema },
      { name: Appointment.name, schema: AppointmentSchema },
    ]),
    AppointmentsModule, 
    WhatsAppModule,
    HospitalsModule,
    CommonModule,
    AuditLogsModule,
  ],
  controllers: [PatientsController],
  providers: [
    PatientsService, 
    PdfService 
  ],
})
export class PatientsModule {}
