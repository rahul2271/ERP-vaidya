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
exports.WhatsAppController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const whatsapp_service_1 = require("./whatsapp.service");
const settings_service_1 = require("../settings/settings.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const public_decorator_1 = require("../auth/public.decorator");
let WhatsAppController = class WhatsAppController {
    whatsappService;
    settingsService;
    constructor(whatsappService, settingsService) {
        this.whatsappService = whatsappService;
        this.settingsService = settingsService;
    }
    verifyWebhook(mode, token, challenge, res) {
        const serverToken = 'veda_erp_secure_token_123';
        if (mode === 'subscribe' && token === serverToken) {
            console.log('✅ WEBHOOK_VERIFIED');
            return res.status(200).send(challenge);
        }
        console.error('❌ WEBHOOK_VERIFICATION_FAILED');
        return res.status(403).send('Verification failed');
    }
    async handleWebhook(body) {
        return this.whatsappService.handleIncoming(body);
    }
    async sendMessage(body, req) {
        const hospitalId = req.user.hospitalId;
        return this.whatsappService.logAndSendMessage(hospitalId, body.leadId, body.phone, body.text, 'ERP');
    }
    async sendMediaMessage(file, body, req) {
        if (!file)
            throw new common_1.BadRequestException('No file uploaded');
        const hospitalId = req.user.hospitalId;
        return this.whatsappService.logAndSendMedia(hospitalId, body.leadId, body.phone, file, body.text || '', 'ERP');
    }
    async getChatHistory(leadId) {
        return this.whatsappService.getHistory(leadId);
    }
};
exports.WhatsAppController = WhatsAppController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('webhook'),
    __param(0, (0, common_1.Query)('hub.mode')),
    __param(1, (0, common_1.Query)('hub.verify_token')),
    __param(2, (0, common_1.Query)('hub.challenge')),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", void 0)
], WhatsAppController.prototype, "verifyWebhook", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('webhook'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WhatsAppController.prototype, "handleWebhook", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('send'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WhatsAppController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('send-media'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], WhatsAppController.prototype, "sendMediaMessage", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':leadId'),
    __param(0, (0, common_1.Param)('leadId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WhatsAppController.prototype, "getChatHistory", null);
exports.WhatsAppController = WhatsAppController = __decorate([
    (0, common_1.Controller)('whatsapp'),
    __metadata("design:paramtypes", [whatsapp_service_1.WhatsAppService,
        settings_service_1.SettingsService])
], WhatsAppController);
//# sourceMappingURL=whatsapp.controller.js.map