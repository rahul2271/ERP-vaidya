"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HospitalsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const hospital_schema_1 = require("./schemas/hospital.schema");
let HospitalsService = class HospitalsService {
    hospitalModel;
    constructor(hospitalModel) {
        this.hospitalModel = hospitalModel;
    }
    async create(createHospitalDto) {
        const createdHospital = new this.hospitalModel(createHospitalDto);
        return createdHospital.save();
    }
    async findAll() {
        return this.hospitalModel.find().exec();
    }
    async findOne(id) {
        const hospital = await this.hospitalModel.findById(id).exec();
        if (!hospital) {
            throw new common_1.NotFoundException(`Hospital with ID ${id} not found`);
        }
        return hospital;
    }
    async update(id, updateHospitalDto) {
        const payload = { ...updateHospitalDto };
        if (payload.plan && !payload.subscriptionStatus) {
            payload.subscriptionStatus = 'ACTIVE';
        }
        const updatedHospital = await this.hospitalModel
            .findByIdAndUpdate(id, payload, { new: true })
            .exec();
        if (!updatedHospital) {
            throw new common_1.NotFoundException(`Hospital with ID ${id} not found`);
        }
        return updatedHospital;
    }
    async updateWhatsAppConfig(hospitalId, accessToken, phoneId) {
        console.log(`🔄 Attempting to update DB for Hospital ID: ${hospitalId}`);
        try {
            const hospital = await this.hospitalModel.findById(hospitalId).exec();
            if (!hospital) {
                throw new common_1.NotFoundException(`Hospital with ID ${hospitalId} not found`);
            }
            if (!hospital.whatsappConfig) {
                hospital.whatsappConfig = {
                    accessToken: '',
                    phoneId: '',
                    businessAccountId: '',
                    verifyToken: ''
                };
            }
            hospital.whatsappConfig.accessToken = accessToken;
            hospital.whatsappConfig.phoneId = phoneId;
            hospital.markModified('whatsappConfig');
            return await hospital.save();
        }
        catch (error) {
            console.error("❌ Mongoose Update Error:", error.message);
            throw error;
        }
    }
    async updatePlan(id, plan) {
        const updatedHospital = await this.hospitalModel
            .findByIdAndUpdate(id, { plan }, { new: true })
            .exec();
        if (!updatedHospital) {
            throw new common_1.NotFoundException(`Hospital with ID ${id} not found`);
        }
        return updatedHospital;
    }
    async activatePaidPlan(id, plan, billingCycle = 'monthly') {
        const renewsAt = new Date();
        if (billingCycle === 'annually') {
            renewsAt.setDate(renewsAt.getDate() + 365);
        }
        else {
            renewsAt.setDate(renewsAt.getDate() + 30);
        }
        const updatedHospital = await this.hospitalModel
            .findByIdAndUpdate(id, { plan, subscriptionStatus: 'ACTIVE', planRenewsAt: renewsAt, billingCycle }, { new: true })
            .exec();
        if (!updatedHospital) {
            throw new common_1.NotFoundException(`Hospital with ID ${id} not found`);
        }
        return updatedHospital;
    }
    async remove(id) {
        const deletedHospital = await this.hospitalModel.findByIdAndDelete(id).exec();
        if (!deletedHospital) {
            throw new common_1.NotFoundException(`Hospital with ID ${id} not found`);
        }
        return deletedHospital;
    }
    async getEffectiveStatus(hospitalId) {
        const hospital = await this.hospitalModel.findById(hospitalId).exec();
        if (!hospital)
            throw new common_1.NotFoundException(`Hospital with ID ${hospitalId} not found`);
        const now = new Date();
        let effectiveStatus = hospital.subscriptionStatus;
        let daysLeft = 0;
        if (hospital.subscriptionStatus === 'TRIALING') {
            if (hospital.trialEndsAt && hospital.trialEndsAt < now) {
                effectiveStatus = 'TRIAL_EXPIRED';
                if (hospital.subscriptionStatus !== effectiveStatus) {
                    await this.hospitalModel.findByIdAndUpdate(hospitalId, { subscriptionStatus: 'TRIAL_EXPIRED' }).exec();
                }
            }
            else if (hospital.trialEndsAt) {
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
};
exports.HospitalsService = HospitalsService;
exports.HospitalsService = HospitalsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(hospital_schema_1.Hospital.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], HospitalsService);
//# sourceMappingURL=hospitals.service.js.map