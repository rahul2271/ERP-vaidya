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
exports.TreatmentsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const treatment_schema_1 = require("./schemas/treatment.schema");
const users_service_1 = require("../users/users.service");
let TreatmentsService = class TreatmentsService {
    treatmentModel;
    usersService;
    constructor(treatmentModel, usersService) {
        this.treatmentModel = treatmentModel;
        this.usersService = usersService;
    }
    async create(createDto, hospitalId) {
        const newTreatment = new this.treatmentModel({
            ...createDto,
            hospitalId: new mongoose_2.Types.ObjectId(hospitalId),
        });
        return newTreatment.save();
    }
    async findAll(hospitalId) {
        return this.treatmentModel.find({
            hospitalId: new mongoose_2.Types.ObjectId(hospitalId),
            isActive: true
        }).exec();
    }
    async remove(id) {
        return this.treatmentModel.findByIdAndUpdate(id, { isActive: false });
    }
    async startTherapySession(treatmentId, therapistId, reqUser) {
        const updatedTreatment = await this.treatmentModel.findByIdAndUpdate(treatmentId, { status: 'IN_PROGRESS' }, { new: true });
        if (therapistId) {
            await this.usersService.update(therapistId, { attendanceStatus: 'BUSY' }, reqUser);
        }
        return updatedTreatment;
    }
    async completeTherapySession(treatmentId, therapistId, reqUser) {
        const updatedTreatment = await this.treatmentModel.findByIdAndUpdate(treatmentId, { status: 'COMPLETED' }, { new: true });
        if (therapistId) {
            await this.usersService.update(therapistId, { attendanceStatus: 'AVAILABLE' }, reqUser);
        }
        return updatedTreatment;
    }
};
exports.TreatmentsService = TreatmentsService;
exports.TreatmentsService = TreatmentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(treatment_schema_1.Treatment.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        users_service_1.UsersService])
], TreatmentsService);
//# sourceMappingURL=treatments.service.js.map