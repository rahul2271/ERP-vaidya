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
exports.TreatmentsController = void 0;
const common_1 = require("@nestjs/common");
const treatments_service_1 = require("./treatments.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let TreatmentsController = class TreatmentsController {
    treatmentsService;
    constructor(treatmentsService) {
        this.treatmentsService = treatmentsService;
    }
    async create(body, req) {
        return this.treatmentsService.create(body, req.user.hospitalId);
    }
    async findAll(req) {
        return this.treatmentsService.findAll(req.user.hospitalId);
    }
};
exports.TreatmentsController = TreatmentsController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TreatmentsController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TreatmentsController.prototype, "findAll", null);
exports.TreatmentsController = TreatmentsController = __decorate([
    (0, common_1.Controller)('treatments'),
    __metadata("design:paramtypes", [treatments_service_1.TreatmentsService])
], TreatmentsController);
//# sourceMappingURL=treatments.controller.js.map