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
var AuditLogsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const audit_log_schema_1 = require("./schemas/audit-log.schema");
let AuditLogsService = AuditLogsService_1 = class AuditLogsService {
    auditLogModel;
    hospitalModel;
    logger = new common_1.Logger(AuditLogsService_1.name);
    constructor(auditLogModel, hospitalModel) {
        this.auditLogModel = auditLogModel;
        this.hospitalModel = hospitalModel;
    }
    async create(logData) {
        try {
            const newLog = new this.auditLogModel(logData);
            return await newLog.save();
        }
        catch (error) {
            this.logger.error(`Failed to save audit log: ${error.message}`, error.stack);
            return null;
        }
    }
    async findAll(query = {}) {
        return this.auditLogModel.find(query).sort({ createdAt: -1 }).exec();
    }
    async logAction(hospitalId, userId, action, module, details) {
        return new this.auditLogModel({ hospitalId, userId, action, module, details }).save();
    }
    async findAllForHospital(hospitalId) {
        const hospital = await this.hospitalModel.findById(hospitalId);
        if (hospital && (hospital.plan === 'BASIC' || hospital.plan === 'basic')) {
            throw new common_1.ForbiddenException('God Mode Security Logs are locked for Basic plans. Please upgrade.');
        }
        return this.auditLogModel.find({ hospitalId })
            .populate('userId', 'name role email')
            .sort({ createdAt: -1 })
            .limit(50)
            .exec();
    }
};
exports.AuditLogsService = AuditLogsService;
exports.AuditLogsService = AuditLogsService = AuditLogsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(audit_log_schema_1.AuditLog.name)),
    __param(1, (0, mongoose_1.InjectModel)('Hospital')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], AuditLogsService);
//# sourceMappingURL=audit-logs.service.js.map