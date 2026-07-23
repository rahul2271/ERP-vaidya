import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { Appointment, AppointmentSchema } from './schemas/appointment.schema';

// ✅ 1. Import the Treatment Schema
import { Treatment, TreatmentSchema } from '../treatments/schemas/treatment.schema'; 

// 🚀 2. Import the WhatsApp Module
import { WhatsAppModule } from 'src/whatsapp/whatsapp.module';
import { CommonModule } from '../common/common.module';
import { HospitalsModule } from '../hospitals/hospitals.module';
import { PdfService } from '../patients/pdf.service';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Appointment.name, schema: AppointmentSchema },
      { name: Treatment.name, schema: TreatmentSchema }, 
    ]),
    
    // 🚀 3. Add it to the imports array here!
    WhatsAppModule,
    CommonModule,
    HospitalsModule,
    AuditLogsModule,
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService, PdfService],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}