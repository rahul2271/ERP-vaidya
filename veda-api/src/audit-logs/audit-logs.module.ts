import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuditLogsController } from './audit-logs.controller';
import { AuditLogsService } from './audit-logs.service';
import { AuditLog, AuditLogSchema } from './schemas/audit-log.schema';

// 🚀 1. Import your Hospital Schema (Adjust path if needed!)
import { Hospital, HospitalSchema } from '../hospitals/schemas/hospital.schema'; 

@Module({
  imports: [
    MongooseModule.forFeature([
      // 1. Existing Audit Log Model
      { name: AuditLog.name, schema: AuditLogSchema },
      
      // 🚀 2. Explicitly provide the Hospital Model so the Service can find it!
      { name: 'Hospital', schema: HospitalSchema } // Make sure 'Hospital' matches what you injected in the Service
    ]),
  ],
  controllers: [AuditLogsController],
  providers: [AuditLogsService],
  exports: [AuditLogsService], 
})
export class AuditLogsModule {}