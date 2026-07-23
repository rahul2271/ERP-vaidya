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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingSchema = exports.Setting = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let Setting = class Setting {
    platformName;
    supportEmail;
    supportPhone;
    timeZone;
    smsApiKey;
    smtpHost;
    smtpPort;
    smtpUser;
    smtpPass;
    razorpayKey;
    defaultWhatsAppToken;
    defaultWhatsAppPhoneId;
    defaultWhatsAppVerifyToken;
    maintenanceMode;
    maxLoginAttempts;
    sessionTimeoutMins;
};
exports.Setting = Setting;
__decorate([
    (0, mongoose_1.Prop)({ default: 'VAIDYA ERP' }),
    __metadata("design:type", String)
], Setting.prototype, "platformName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'support@vaidyaerp.com' }),
    __metadata("design:type", String)
], Setting.prototype, "supportEmail", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '+91 9876543210' }),
    __metadata("design:type", String)
], Setting.prototype, "supportPhone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'Asia/Kolkata' }),
    __metadata("design:type", String)
], Setting.prototype, "timeZone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], Setting.prototype, "smsApiKey", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], Setting.prototype, "smtpHost", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '587' }),
    __metadata("design:type", String)
], Setting.prototype, "smtpPort", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], Setting.prototype, "smtpUser", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], Setting.prototype, "smtpPass", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], Setting.prototype, "razorpayKey", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], Setting.prototype, "defaultWhatsAppToken", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], Setting.prototype, "defaultWhatsAppPhoneId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'veda_erp_secure_token_123' }),
    __metadata("design:type", String)
], Setting.prototype, "defaultWhatsAppVerifyToken", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Setting.prototype, "maintenanceMode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 5 }),
    __metadata("design:type", Number)
], Setting.prototype, "maxLoginAttempts", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 120 }),
    __metadata("design:type", Number)
], Setting.prototype, "sessionTimeoutMins", void 0);
exports.Setting = Setting = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Setting);
exports.SettingSchema = mongoose_1.SchemaFactory.createForClass(Setting);
//# sourceMappingURL=setting.schema.js.map