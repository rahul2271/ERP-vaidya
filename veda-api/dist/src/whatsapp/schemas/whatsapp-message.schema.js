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
exports.WhatsAppMessageSchema = exports.WhatsAppMessage = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let WhatsAppMessage = class WhatsAppMessage extends mongoose_2.Document {
    leadId;
    patientPhone;
    sender;
    messageType;
    text;
    mediaUrl;
    mediaId;
    status;
    isRead;
};
exports.WhatsAppMessage = WhatsAppMessage;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], WhatsAppMessage.prototype, "leadId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], WhatsAppMessage.prototype, "patientPhone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['ERP', 'PATIENT'] }),
    __metadata("design:type", String)
], WhatsAppMessage.prototype, "sender", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'TEXT', enum: ['TEXT', 'IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT'] }),
    __metadata("design:type", String)
], WhatsAppMessage.prototype, "messageType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], WhatsAppMessage.prototype, "text", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], WhatsAppMessage.prototype, "mediaUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], WhatsAppMessage.prototype, "mediaId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'DELIVERED' }),
    __metadata("design:type", String)
], WhatsAppMessage.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], WhatsAppMessage.prototype, "isRead", void 0);
exports.WhatsAppMessage = WhatsAppMessage = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], WhatsAppMessage);
exports.WhatsAppMessageSchema = mongoose_1.SchemaFactory.createForClass(WhatsAppMessage);
//# sourceMappingURL=whatsapp-message.schema.js.map