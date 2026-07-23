import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Treatment, TreatmentDocument } from './schemas/treatment.schema';
// 🚀 1. Import the UsersService
import { UsersService } from '../users/users.service'; 

@Injectable()
export class TreatmentsService {
  constructor(
    @InjectModel(Treatment.name) private treatmentModel: Model<TreatmentDocument>,
    // 🚀 2. Inject UsersService
    private usersService: UsersService 
  ) {}

  // ✅ EXISTING: Kept completely intact
  async create(createDto: any, hospitalId: string) {
    const newTreatment = new this.treatmentModel({
      ...createDto,
      hospitalId: new Types.ObjectId(hospitalId),
    });
    return newTreatment.save();
  }

  // ✅ EXISTING: Kept completely intact
  async findAll(hospitalId: string) {
    return this.treatmentModel.find({ 
      hospitalId: new Types.ObjectId(hospitalId), 
      isActive: true 
    }).exec();
  }

  // ✅ EXISTING: Kept completely intact
  async remove(id: string) {
    return this.treatmentModel.findByIdAndUpdate(id, { isActive: false });
  }

  // ==========================================
  // 🚀 NEW: AUTOMATION - START THERAPY
  // ==========================================
  async startTherapySession(treatmentId: string, therapistId: string, reqUser: any) {
    // 1. Update the treatment record's status to 'IN_PROGRESS'
    const updatedTreatment = await this.treatmentModel.findByIdAndUpdate(
      treatmentId,
      { status: 'IN_PROGRESS' }, // Adjust this string to match your schema if needed
      { new: true }
    );

    // 2. AUTOMATION: Change the Therapist's Live Roster status to "BUSY" (Red dot)
    if (therapistId) {
      await this.usersService.update(
        therapistId, 
        { attendanceStatus: 'BUSY' }, 
        reqUser // Triggers the God Mode Audit Log!
      );
    }

    return updatedTreatment;
  }

  // ==========================================
  // 🚀 NEW: AUTOMATION - COMPLETE THERAPY
  // ==========================================
  async completeTherapySession(treatmentId: string, therapistId: string, reqUser: any) {
    // 1. Update the treatment record's status to 'COMPLETED'
    const updatedTreatment = await this.treatmentModel.findByIdAndUpdate(
      treatmentId,
      { status: 'COMPLETED' }, // Adjust this string to match your schema if needed
      { new: true }
    );

    // 2. AUTOMATION: Free up the Therapist so they show as "AVAILABLE" (Green dot) again
    if (therapistId) {
      await this.usersService.update(
        therapistId, 
        { attendanceStatus: 'AVAILABLE' }, 
        reqUser // Triggers the God Mode Audit Log!
      );
    }

    return updatedTreatment;
  }
}