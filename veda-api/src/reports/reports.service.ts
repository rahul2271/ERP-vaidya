import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Report, ReportDocument } from './schemas/report.schema';

@Injectable()
export class ReportsService {
  constructor(@InjectModel(Report.name) private reportModel: Model<ReportDocument>) {}

  async getPendingForDoctor(hospitalId: string) {
    return this.reportModel.find({ hospitalId, status: 'READY' }).sort({ createdAt: -1 }).exec();
  }

  async markAsReviewed(id: string) {
    return this.reportModel.findByIdAndUpdate(id, { status: 'REVIEWED' }, { new: true });
  }
}