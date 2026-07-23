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
exports.TallyController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_enum_1 = require("../auth/roles.enum");
const tally_service_1 = require("./tally.service");
let TallyController = class TallyController {
    tallyService;
    constructor(tallyService) {
        this.tallyService = tallyService;
    }
    async exportStockItems(req, res) {
        const xml = await this.tallyService.exportStockItems(req.user.hospitalId);
        res.set({
            'Content-Type': 'application/xml',
            'Content-Disposition': `attachment; filename="tally_stock_items_${new Date().toISOString().split('T')[0]}.xml"`,
        });
        res.send(xml);
    }
    async exportSalesVouchers(startDate, endDate, req, res) {
        const xml = await this.tallyService.exportSalesVouchers(req.user.hospitalId, startDate, endDate);
        res.set({
            'Content-Type': 'application/xml',
            'Content-Disposition': `attachment; filename="tally_sales_vouchers_${startDate}_to_${endDate}.xml"`,
        });
        res.send(xml);
    }
    testConnection(req) {
        return this.tallyService.testConnection(req.user.hospitalId);
    }
    pullStock(req) {
        return this.tallyService.pullStockItemsFromTally(req.user.hospitalId);
    }
    pushVouchers(startDate, endDate, req) {
        return this.tallyService.pushSalesVouchersLive(req.user.hospitalId, startDate, endDate);
    }
};
exports.TallyController = TallyController;
__decorate([
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN, roles_enum_1.Role.SUPER_ADMIN),
    (0, common_1.Get)('export/stock-items'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TallyController.prototype, "exportStockItems", null);
__decorate([
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN, roles_enum_1.Role.SUPER_ADMIN),
    (0, common_1.Get)('export/sales-vouchers'),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, common_1.Request)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], TallyController.prototype, "exportSalesVouchers", null);
__decorate([
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN, roles_enum_1.Role.SUPER_ADMIN),
    (0, common_1.Get)('test-connection'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TallyController.prototype, "testConnection", null);
__decorate([
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN, roles_enum_1.Role.SUPER_ADMIN),
    (0, common_1.Get)('sync/pull-stock'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TallyController.prototype, "pullStock", null);
__decorate([
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN, roles_enum_1.Role.SUPER_ADMIN),
    (0, common_1.Get)('sync/push-vouchers'),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], TallyController.prototype, "pushVouchers", null);
exports.TallyController = TallyController = __decorate([
    (0, common_1.Controller)('tally'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [tally_service_1.TallyService])
], TallyController);
//# sourceMappingURL=tally.controller.js.map