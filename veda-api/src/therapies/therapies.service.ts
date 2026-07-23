import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Therapy, TherapyDocument } from './schemas/therapy.schema';

@Injectable()
export class TherapiesService {
  constructor(@InjectModel(Therapy.name) private therapyModel: Model<TherapyDocument>) {}

  // 1. Used by Doctors/Receptionists to schedule a new therapy
  async create(createDto: any) {
    const newTherapy = new this.therapyModel(createDto);
    return newTherapy.save();
  }

  // 2. Used by the Therapist Dashboard to see today's schedule
  async getTodayTherapiesForTherapist(therapistId: string, hospitalId: string) {
    // Get start and end of the current day
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tonight = new Date(today);
    tonight.setHours(23, 59, 59, 999);

    return this.therapyModel.find({
      therapistId: therapistId,
      hospitalId: hospitalId,
      date: { $gte: today, $lte: tonight }
    }).sort({ time: 1 }).exec();
  }

  // 3. Used by Therapist Action Buttons to Start/Complete sessions
  async updateStatus(id: string, status: string, hospitalId: string) {
    const updated = await this.therapyModel.findOneAndUpdate(
      { _id: id, hospitalId: hospitalId },
      { status: status },
      { new: true } // Returns the updated document
    );
    
    if (!updated) throw new NotFoundException('Therapy session not found');
    return updated;
  }
  async getTherapyHistoryForTherapist(therapistId: string, hospitalId: string) {
    return this.therapyModel.find({
      therapistId: therapistId,
      hospitalId: hospitalId
    }).sort({ date: -1, time: -1 }).exec(); // Sorts newest to oldest
  }

  async getTherapiesByPatient(patientId: string, hospitalId: string) {
    return this.therapyModel.find({
      patientId: patientId,
      hospitalId: hospitalId
    })
    .sort({ date: -1 }) // Newest first
    .populate('therapistId', 'name') // Pulls the therapist's name
    .exec();
  }

  async getAllTherapiesForHospital(hospitalId: string) {
    return this.therapyModel.find({ hospitalId: hospitalId })
      .sort({ date: -1, time: -1 })
      .populate('therapistId', 'name') // Gets the assigned therapist's name
      .exec();
  }
}