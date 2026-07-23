import { Module } from '@nestjs/common';
import { CallsController } from './calls.controller';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';

@Module({
  imports: [AuditLogsModule], // Import this so we can log calls in God Mode
  controllers: [CallsController],
  providers: [],
})
export class CallsModule {}