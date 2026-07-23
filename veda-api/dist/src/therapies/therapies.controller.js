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
exports.TherapiesController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_enum_1 = require("../auth/roles.enum");
const therapies_service_1 = require("./therapies.service");
let TherapiesController = class TherapiesController {
    therapiesService;
    constructor(therapiesService) {
        this.therapiesService = therapiesService;
    }
    create(createDto, req) {
        return this.therapiesService.create({
            ...createDto,
            hospitalId: req.user.hospitalId
        });
    }
    getTodayTherapies(req) {
        const therapistId = req.user.sub || req.user.userId;
        return this.therapiesService.getTodayTherapiesForTherapist(therapistId, req.user.hospitalId);
    }
    updateStatus(id, status, req) {
        return this.therapiesService.updateStatus(id, status, req.user.hospitalId);
    }
    getTherapyHistory(req) {
        const therapistId = req.user.sub || req.user.userId;
        return this.therapiesService.getTherapyHistoryForTherapist(therapistId, req.user.hospitalId);
    }
    getPatientTherapies(patientId, req) {
        return this.therapiesService.getTherapiesByPatient(patientId, req.user.hospitalId);
    }
    getAllTherapies(req) {
        return this.therapiesService.getAllTherapiesForHospital(req.user.hospitalId);
    }
};
exports.TherapiesController = TherapiesController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.DOCTOR, roles_enum_1.Role.RECEPTIONIST, roles_enum_1.Role.ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], TherapiesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('me/today'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.THERAPIST),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TherapiesController.prototype, "getTodayTherapies", null);
__decorate([
    (0, common_1.Put)(':id/status'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.THERAPIST, roles_enum_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], TherapiesController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Get)('me/history'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.THERAPIST),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TherapiesController.prototype, "getTherapyHistory", null);
__decorate([
    (0, common_1.Get)('patient/:id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TherapiesController.prototype, "getPatientTherapies", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.DOCTOR, roles_enum_1.Role.ADMIN, roles_enum_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TherapiesController.prototype, "getAllTherapies", null);
exports.TherapiesController = TherapiesController = __decorate([
    (0, common_1.Controller)('therapies'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [therapies_service_1.TherapiesService])
], TherapiesController);
//# sourceMappingURL=therapies.controller.js.map