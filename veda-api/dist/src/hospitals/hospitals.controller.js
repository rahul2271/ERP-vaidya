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
exports.HospitalsController = void 0;
const common_1 = require("@nestjs/common");
const hospitals_service_1 = require("./hospitals.service");
const create_hospital_dto_1 = require("./dto/create-hospital.dto");
const update_hospital_dto_1 = require("./dto/update-hospital.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_enum_1 = require("../auth/roles.enum");
let HospitalsController = class HospitalsController {
    hospitalsService;
    constructor(hospitalsService) {
        this.hospitalsService = hospitalsService;
    }
    async getMyClinic(req) {
        const hospitalId = req.user?.hospitalId;
        if (!hospitalId)
            throw new common_1.BadRequestException("No hospital ID found in your token.");
        return this.hospitalsService.findOne(hospitalId);
    }
    async updateMyClinic(req, body) {
        console.log("📝 --- INCOMING CLINIC SETTINGS UPDATE ---");
        console.log("User JWT Payload:", req.user);
        console.log("Body Payload:", body);
        const hospitalId = req.user?.hospitalId;
        if (!hospitalId) {
            console.error("❌ CRITICAL ERROR: req.user.hospitalId is undefined!");
            throw new common_1.BadRequestException("Your account is not linked to a valid hospital ID.");
        }
        try {
            const result = await this.hospitalsService.update(hospitalId, body);
            console.log("✅ Successfully updated clinic settings!");
            return result;
        }
        catch (error) {
            console.error("❌ DATABASE ERROR:", error);
            throw new common_1.InternalServerErrorException("Failed to update database. Check backend logs.");
        }
    }
    async getMyPlan(req) {
        const hospitalId = req.user?.hospitalId;
        if (!hospitalId)
            return { plan: 'BASIC', subscriptionStatus: 'ACTIVE', isBlocked: false, daysLeft: 0 };
        return this.hospitalsService.getEffectiveStatus(hospitalId);
    }
    async updateWhatsAppConfigSuperAdmin(id, config) {
        return this.hospitalsService.update(id, { whatsappConfig: config });
    }
    create(createHospitalDto) {
        return this.hospitalsService.create(createHospitalDto);
    }
    findAll() {
        return this.hospitalsService.findAll();
    }
    findOne(id) {
        return this.hospitalsService.findOne(id);
    }
    update(id, updateHospitalDto) {
        return this.hospitalsService.update(id, updateHospitalDto);
    }
    remove(id) {
        return this.hospitalsService.remove(id);
    }
};
exports.HospitalsController = HospitalsController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('my-clinic'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HospitalsController.prototype, "getMyClinic", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)('my-clinic'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], HospitalsController.prototype, "updateMyClinic", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('my-plan'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HospitalsController.prototype, "getMyPlan", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.SUPER_ADMIN),
    (0, common_1.Patch)(':id/whatsapp-config'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], HospitalsController.prototype, "updateWhatsAppConfigSuperAdmin", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.SUPER_ADMIN),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_hospital_dto_1.CreateHospitalDto]),
    __metadata("design:returntype", void 0)
], HospitalsController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.SUPER_ADMIN),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HospitalsController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.SUPER_ADMIN),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HospitalsController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.SUPER_ADMIN),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_hospital_dto_1.UpdateHospitalDto]),
    __metadata("design:returntype", void 0)
], HospitalsController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.SUPER_ADMIN),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HospitalsController.prototype, "remove", null);
exports.HospitalsController = HospitalsController = __decorate([
    (0, common_1.Controller)('hospitals'),
    __metadata("design:paramtypes", [hospitals_service_1.HospitalsService])
], HospitalsController);
//# sourceMappingURL=hospitals.controller.js.map