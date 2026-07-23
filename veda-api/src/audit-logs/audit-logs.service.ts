import { Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog, AuditLogDocument } from './schemas/audit-log.schema';

@Injectable()
export class AuditLogsService {
  private readonly logger = new Logger(AuditLogsService.name);

  constructor(
    @InjectModel(AuditLog.name) private auditLogModel: Model<AuditLogDocument>,
    // 🚀 1. Inject HospitalModel to verify SaaS plans
    @InjectModel('Hospital') private hospitalModel: Model<any> 
  ) {}

  // 🚀 Update the return type here to include "| null"
  async create(logData: Partial<AuditLog>): Promise<AuditLogDocument | null> {
    try {
      const newLog = new this.auditLogModel(logData);
      return await newLog.save();
    } catch (error) {
      this.logger.error(`Failed to save audit log: ${error.message}`, error.stack);
      return null; // Now TypeScript is happy with this!
    }
  }

  async findAll(query: any = {}) {
    // Assuming you are using Mongoose based on your frontend having _id
    return this.auditLogModel.find(query).sort({ createdAt: -1 }).exec();
  }

  // ✅ EXISTING: Function to create a log from other services (Billing, Patients, etc.)
  async logAction(hospitalId: any, userId: any, action: string, module: string, details: string) {
    return new this.auditLogModel({ hospitalId, userId, action, module, details }).save();
  }

  // 🚀 UPGRADED: Fetch logs with STRICT PREMIUM Plan Check!
  async findAllForHospital(hospitalId: string) {
    // 1. Check the Hospital's Plan
    const hospital = await this.hospitalModel.findById(hospitalId);
    
    // 2. Block access if they are on the BASIC plan
    if (hospital && (hospital.plan === 'BASIC' || hospital.plan === 'basic')) {
      throw new ForbiddenException('God Mode Security Logs are locked for Basic plans. Please upgrade.');
    }

    // 3. If Premium, return the logs securely
    return this.auditLogModel.find({ hospitalId })
      .populate('userId', 'name role email') // Added email here just in case you want to display it!
      .sort({ createdAt: -1 })
      .limit(50) // Get the latest 50 logs
      .exec();
  }
}