import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Hospital } from './schemas/hospital.schema';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';

@Injectable()
export class HospitalsService {
  constructor(@InjectModel(Hospital.name) private hospitalModel: Model<Hospital>) {}

  // Create
  async create(createHospitalDto: CreateHospitalDto) {
    const createdHospital = new this.hospitalModel(createHospitalDto);
    return createdHospital.save();
  }

  // Find All
  async findAll() {
    return this.hospitalModel.find().exec();
  }

  // Find One by ID
  async findOne(id: string) {
    const hospital = await this.hospitalModel.findById(id).exec();
    if (!hospital) {
      throw new NotFoundException(`Hospital with ID ${id} not found`);
    }
    return hospital;
  }

  // Update
  async update(id: string, updateHospitalDto: UpdateHospitalDto) {
    // If a plan is being set manually (e.g. Super Admin toggling a tenant's plan)
    // and no explicit subscriptionStatus was given, treat it as taking the hospital
    // off any trial state — otherwise a manually-granted plan would still show as "TRIALING".
    const payload: any = { ...updateHospitalDto };
    if (payload.plan && !payload.subscriptionStatus) {
      payload.subscriptionStatus = 'ACTIVE';
    }

    const updatedHospital = await this.hospitalModel
      .findByIdAndUpdate(id, payload, { new: true })
      .exec();
      
    if (!updatedHospital) {
      throw new NotFoundException(`Hospital with ID ${id} not found`);
    }
    return updatedHospital;
  }

  // 🚀 NEW: Specific method for updating Clinic WhatsApp Keys (Multi-Tenant)
  // 🚀 FIXED: Safely update Clinic WhatsApp Keys (Multi-Tenant)
  async updateWhatsAppConfig(hospitalId: string, accessToken: string, phoneId: string) {
    console.log(`🔄 Attempting to update DB for Hospital ID: ${hospitalId}`);
    
    try {
      // 1. Find the hospital first
      const hospital = await this.hospitalModel.findById(hospitalId).exec();

      if (!hospital) {
        throw new NotFoundException(`Hospital with ID ${hospitalId} not found`);
      }

      // 2. If whatsappConfig is null, initialize it safely
      if (!hospital.whatsappConfig) {
        hospital.whatsappConfig = {
          accessToken: '',
          phoneId: '',
          businessAccountId: '',
          verifyToken: ''
        };
      }

      // 3. Update the specific keys
      hospital.whatsappConfig.accessToken = accessToken;
      hospital.whatsappConfig.phoneId = phoneId;

      // 4. Tell Mongoose this nested object was changed
      hospital.markModified('whatsappConfig');

      // 5. Save and return
      return await hospital.save();
      
    } catch (error: any) {
      console.error("❌ Mongoose Update Error:", error.message);
      throw error;
    }
  }

  // 🚀 Specific method for Subscription Upgrades
  async updatePlan(id: string, plan: string) {
    const updatedHospital = await this.hospitalModel
      .findByIdAndUpdate(id, { plan }, { new: true })
      .exec();

    if (!updatedHospital) {
      throw new NotFoundException(`Hospital with ID ${id} not found`);
    }
    return updatedHospital;
  }

  // ✅ Called by the Razorpay webhook after a verified successful payment —
  // moves the hospital off trial (if it was on one) and marks it as a paying,
  // active subscriber on the plan they paid for.
  async activatePaidPlan(id: string, plan: string, billingCycle: 'monthly' | 'annually' = 'monthly') {
    const renewsAt = new Date();
    if (billingCycle === 'annually') {
      renewsAt.setDate(renewsAt.getDate() + 365);
    } else {
      renewsAt.setDate(renewsAt.getDate() + 30);
    }

    const updatedHospital = await this.hospitalModel
      .findByIdAndUpdate(id, { plan, subscriptionStatus: 'ACTIVE', planRenewsAt: renewsAt, billingCycle }, { new: true })
      .exec();

    if (!updatedHospital) {
      throw new NotFoundException(`Hospital with ID ${id} not found`);
    }
    return updatedHospital;
  }

  // Remove
  async remove(id: string) {
    const deletedHospital = await this.hospitalModel.findByIdAndDelete(id).exec();
    if (!deletedHospital) {
      throw new NotFoundException(`Hospital with ID ${id} not found`);
    }
    return deletedHospital;
  }

  // ✅ SELF-SERVE TRIAL: computes the *effective* status live rather than relying on
  // a background cron job. This means it's always correct the instant someone
  // logs in or checks their plan, with no scheduled job required.
  // If the stored status is still TRIALING but trialEndsAt has passed, it lazily
  // persists the TRIAL_EXPIRED state so the Super Admin's hospital list stays accurate
  // even for hospitals nobody has logged into since expiry.
  async getEffectiveStatus(hospitalId: string) {
    const hospital = await this.hospitalModel.findById(hospitalId).exec();
    if (!hospital) throw new NotFoundException(`Hospital with ID ${hospitalId} not found`);

    const now = new Date();
    let effectiveStatus = hospital.subscriptionStatus;
    let daysLeft = 0;

    if (hospital.subscriptionStatus === 'TRIALING') {
      if (hospital.trialEndsAt && hospital.trialEndsAt < now) {
        effectiveStatus = 'TRIAL_EXPIRED';
        if (hospital.subscriptionStatus !== effectiveStatus) {
          await this.hospitalModel.findByIdAndUpdate(hospitalId, { subscriptionStatus: 'TRIAL_EXPIRED' }).exec();
        }
      } else if (hospital.trialEndsAt) {
        daysLeft = Math.max(0, Math.ceil((hospital.trialEndsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
      }
    }

    return {
      subscriptionStatus: effectiveStatus,
      plan: hospital.plan,
      trialEndsAt: hospital.trialEndsAt,
      planRenewsAt: hospital.planRenewsAt,
      daysLeft,
      isBlocked: effectiveStatus === 'TRIAL_EXPIRED',
    };
  }
}