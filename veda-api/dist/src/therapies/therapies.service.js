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
exports.TherapiesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const therapy_schema_1 = require("./schemas/therapy.schema");
let TherapiesService = class TherapiesService {
    therapyModel;
    constructor(therapyModel) {
        this.therapyModel = therapyModel;
    }
    async create(createDto) {
        const newTherapy = new this.therapyModel(createDto);
        return newTherapy.save();
    }
    async getTodayTherapiesForTherapist(therapistId, hospitalId) {
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
    async updateStatus(id, status, hospitalId) {
        const updated = await this.therapyModel.findOneAndUpdate({ _id: id, hospitalId: hospitalId }, { status: status }, { new: true });
        if (!updated)
            throw new common_1.NotFoundException('Therapy session not found');
        return updated;
    }
    async getTherapyHistoryForTherapist(therapistId, hospitalId) {
        return this.therapyModel.find({
            therapistId: therapistId,
            hospitalId: hospitalId
        }).sort({ date: -1, time: -1 }).exec();
    }
    async getTherapiesByPatient(patientId, hospitalId) {
        return this.therapyModel.find({
            patientId: patientId,
            hospitalId: hospitalId
        })
            .sort({ date: -1 })
            .populate('therapistId', 'name')
            .exec();
    }
    async getAllTherapiesForHospital(hospitalId) {
        return this.therapyModel.find({ hospitalId: hospitalId })
            .sort({ date: -1, time: -1 })
            .populate('therapistId', 'name')
            .exec();
    }
};
exports.TherapiesService = TherapiesService;
exports.TherapiesService = TherapiesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(therapy_schema_1.Therapy.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], TherapiesService);
//# sourceMappingURL=therapies.service.js.map