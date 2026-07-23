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
exports.SettingsController = void 0;
const common_1 = require("@nestjs/common");
const settings_service_1 = require("./settings.service");
const update_setting_dto_1 = require("./dto/update-setting.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_enum_1 = require("../auth/roles.enum");
const mail_service_1 = require("../mail/mail.service");
let SettingsController = class SettingsController {
    settingsService;
    mailService;
    constructor(settingsService, mailService) {
        this.settingsService = settingsService;
        this.mailService = mailService;
    }
    async getGlobalSettings() {
        return this.settingsService.getGlobalSettings();
    }
    async updateGlobalSettings(updateSettingDto) {
        return this.settingsService.updateGlobalSettings(updateSettingDto);
    }
    async testEmailConnection() {
        try {
            const settings = await this.settingsService.getGlobalSettings();
            await this.mailService.sendWelcomeEmail(settings.supportEmail, 'Super Admin', 'TEST_PING', 'N/A');
            return {
                success: true,
                message: `Test email dispatched to ${settings.supportEmail}.`
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'SMTP Handshake failed. Check your settings.'
            };
        }
    }
};
exports.SettingsController = SettingsController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.SUPER_ADMIN, roles_enum_1.Role.ADMIN, roles_enum_1.Role.TELECALLER, roles_enum_1.Role.DOCTOR, roles_enum_1.Role.RECEPTIONIST),
    (0, common_1.Get)('global'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "getGlobalSettings", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.SUPER_ADMIN),
    (0, common_1.Patch)('global'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_setting_dto_1.UpdateSettingDto]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "updateGlobalSettings", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.SUPER_ADMIN),
    (0, common_1.Post)('test-email'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "testEmailConnection", null);
exports.SettingsController = SettingsController = __decorate([
    (0, common_1.Controller)('settings'),
    __metadata("design:paramtypes", [settings_service_1.SettingsService,
        mail_service_1.MailService])
], SettingsController);
//# sourceMappingURL=settings.controller.js.map