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
exports.PharmacyController = void 0;
const common_1 = require("@nestjs/common");
const pharmacy_service_1 = require("./pharmacy.service");
const passport_1 = require("@nestjs/passport");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_enum_1 = require("../auth/roles.enum");
const roles_guard_1 = require("../auth/roles.guard");
let PharmacyController = class PharmacyController {
    pharmacyService;
    constructor(pharmacyService) {
        this.pharmacyService = pharmacyService;
    }
    createSale(saleData, req) {
        return this.pharmacyService.createSale(saleData, req.user);
    }
    getDailySettlement(req, date) {
        const targetDate = date || new Date().toISOString();
        return this.pharmacyService.getDailySettlement(req.user.hospitalId, targetDate);
    }
    getAllSales(req) {
        return this.pharmacyService.getAllSales(req.user.hospitalId);
    }
};
exports.PharmacyController = PharmacyController;
__decorate([
    (0, common_1.Post)('sale'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.SUPER_ADMIN, roles_enum_1.Role.ADMIN, roles_enum_1.Role.PHARMACIST, roles_enum_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PharmacyController.prototype, "createSale", null);
__decorate([
    (0, common_1.Get)('settlement'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.SUPER_ADMIN, roles_enum_1.Role.ADMIN, roles_enum_1.Role.PHARMACIST, roles_enum_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PharmacyController.prototype, "getDailySettlement", null);
__decorate([
    (0, common_1.Get)('sales'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.SUPER_ADMIN, roles_enum_1.Role.ADMIN, roles_enum_1.Role.PHARMACIST, roles_enum_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PharmacyController.prototype, "getAllSales", null);
exports.PharmacyController = PharmacyController = __decorate([
    (0, common_1.Controller)('pharmacy'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [pharmacy_service_1.PharmacyService])
], PharmacyController);
//# sourceMappingURL=pharmacy.controller.js.map