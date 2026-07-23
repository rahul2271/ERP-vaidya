"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var WhatsAppService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsAppService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const whatsapp_message_schema_1 = require("./schemas/whatsapp-message.schema");
const hospital_schema_1 = require("../hospitals/schemas/hospital.schema");
const settings_service_1 = require("../settings/settings.service");
const axios_1 = __importDefault(require("axios"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const form_data_1 = __importDefault(require("form-data"));
let WhatsAppService = WhatsAppService_1 = class WhatsAppService {
    waModel;
    leadModel;
    hospitalModel;
    settingsService;
    logger = new common_1.Logger(WhatsAppService_1.name);
    constructor(waModel, leadModel, hospitalModel, settingsService) {
        this.waModel = waModel;
        this.leadModel = leadModel;
        this.hospitalModel = hospitalModel;
        this.settingsService = settingsService;
    }
    cleanPhone(phone) {
        let cleaned = String(phone).replace(/\D/g, '');
        if (cleaned.startsWith('91') && cleaned.length === 12) {
            return cleaned.substring(2);
        }
        return cleaned;
    }
    async logAndSendMessage(hospitalId, leadId, phone, text, sender) {
        if (!phone || !text || !leadId || !hospitalId) {
            throw new common_1.BadRequestException("Missing required fields for WhatsApp message.");
        }
        const newMessage = new this.waModel({
            leadId,
            patientPhone: this.cleanPhone(phone),
            sender,
            text,
            status: 'SENT'
        });
        const savedMessage = await newMessage.save();
        try {
            const hospital = await this.hospitalModel.findById(hospitalId).exec();
            const globalSettings = await this.settingsService.getGlobalSettings();
            const token = (hospital?.whatsappConfig?.accessToken || globalSettings?.defaultWhatsAppToken)?.trim();
            const phoneId = (hospital?.whatsappConfig?.phoneId || globalSettings?.defaultWhatsAppPhoneId)?.trim();
            if (!token || !phoneId) {
                this.logger.error(`🚨 CRITICAL: No WhatsApp token found for Hospital ${hospitalId}!`);
                return savedMessage;
            }
            let formattedPhone = String(phone).replace(/\D/g, '');
            if (formattedPhone.length === 10)
                formattedPhone = `91${formattedPhone}`;
            await axios_1.default.post(`https://graph.facebook.com/v22.0/${phoneId}/messages`, { messaging_product: 'whatsapp', to: formattedPhone, type: 'text', text: { body: text } }, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } });
            this.logger.log(`✅ WhatsApp sent to ${formattedPhone}`);
            return savedMessage;
        }
        catch (error) {
            this.logger.error('Meta API Error:', error.response?.data || error.message);
            return savedMessage;
        }
    }
    async logAndSendMedia(hospitalId, leadId, phone, file, caption, sender) {
        let formattedPhone = String(phone).replace(/\D/g, '');
        if (formattedPhone.length === 10)
            formattedPhone = `91${formattedPhone}`;
        try {
            const mimeType = file.mimetype;
            let messageType = 'DOCUMENT';
            let metaType = 'document';
            if (mimeType.startsWith('image/')) {
                messageType = 'IMAGE';
                metaType = 'image';
            }
            else if (mimeType.startsWith('video/')) {
                messageType = 'VIDEO';
                metaType = 'video';
            }
            const hospital = await this.hospitalModel.findById(hospitalId).exec();
            const globalSettings = await this.settingsService.getGlobalSettings();
            const token = (hospital?.whatsappConfig?.accessToken || globalSettings?.defaultWhatsAppToken)?.trim();
            const phoneId = (hospital?.whatsappConfig?.phoneId || globalSettings?.defaultWhatsAppPhoneId)?.trim();
            if (!token || !phoneId)
                throw new Error("No WhatsApp token found!");
            const formData = new form_data_1.default();
            formData.append('file', file.buffer, { filename: file.originalname, contentType: file.mimetype });
            formData.append('messaging_product', 'whatsapp');
            const uploadResponse = await axios_1.default.post(`https://graph.facebook.com/v22.0/${phoneId}/media`, formData, {
                headers: { ...formData.getHeaders(), Authorization: `Bearer ${token}` }
            });
            const uploadedMediaId = uploadResponse.data.id;
            const messagePayload = { messaging_product: 'whatsapp', to: formattedPhone, type: metaType };
            if (metaType === 'document') {
                messagePayload.document = { id: uploadedMediaId, filename: file.originalname };
                if (caption)
                    messagePayload.document.caption = caption;
            }
            else {
                messagePayload[metaType] = { id: uploadedMediaId };
                if (caption)
                    messagePayload[metaType].caption = caption;
            }
            await axios_1.default.post(`https://graph.facebook.com/v22.0/${phoneId}/messages`, messagePayload, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
            const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'whatsapp');
            if (!fs.existsSync(uploadDir))
                fs.mkdirSync(uploadDir, { recursive: true });
            const uniqueFileName = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
            fs.writeFileSync(path.join(uploadDir, uniqueFileName), file.buffer);
            const newMessage = new this.waModel({
                leadId, patientPhone: this.cleanPhone(phone), sender, text: caption || `Sent ${messageType}`,
                messageType, mediaId: uploadedMediaId, mediaUrl: `/uploads/whatsapp/${uniqueFileName}`, status: 'SENT'
            });
            return await newMessage.save();
        }
        catch (error) {
            this.logger.error('Meta Media Upload/Send Error:', error.response?.data || error.message);
            throw new Error("Failed to send media via Meta API");
        }
    }
    async downloadMediaFile(mediaId, token, extension = 'jpg') {
        try {
            const urlResponse = await axios_1.default.get(`https://graph.facebook.com/v22.0/${mediaId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const mediaUrl = urlResponse.data?.url;
            if (!mediaUrl)
                throw new Error("Meta API did not return a valid download URL.");
            const fileResponse = await axios_1.default.get(mediaUrl, {
                headers: { Authorization: `Bearer ${token}` }, responseType: 'arraybuffer'
            });
            const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'whatsapp');
            if (!fs.existsSync(uploadDir))
                fs.mkdirSync(uploadDir, { recursive: true });
            const fileName = `${mediaId}.${extension}`;
            fs.writeFileSync(path.join(uploadDir, fileName), Buffer.from(fileResponse.data));
            return `/uploads/whatsapp/${fileName}`;
        }
        catch (error) {
            this.logger.error(`Failed to download media ${mediaId}`);
            return null;
        }
    }
    async saveIncomingMessage(hospitalId, phone, text, messageType = 'TEXT', mediaId = null) {
        try {
            const cleanPhoneNum = this.cleanPhone(phone);
            const matchQuery = {
                patientPhone: { $in: [phone, cleanPhoneNum, `+${phone}`] },
                leadId: { $exists: true, $ne: null, $nin: ['UNKNOWN_LEAD', ''] }
            };
            const previousMessages = await this.waModel.find(matchQuery).sort({ createdAt: -1 }).exec();
            let matchedLeadId = "UNKNOWN_LEAD";
            if (hospitalId && previousMessages.length > 0) {
                for (const msg of previousMessages) {
                    const lead = await this.leadModel.findById(msg.leadId).exec();
                    if (lead && lead.hospitalId.toString() === hospitalId.toString()) {
                        matchedLeadId = lead._id;
                        break;
                    }
                }
            }
            let localMediaUrl = null;
            if (mediaId) {
                const globalSettings = await this.settingsService.getGlobalSettings();
                let token = globalSettings?.defaultWhatsAppToken;
                if (hospitalId) {
                    const hospital = await this.hospitalModel.findById(hospitalId).exec();
                    token = hospital?.whatsappConfig?.accessToken || token;
                }
                if (token) {
                    const ext = messageType === 'VIDEO' ? 'mp4' : messageType === 'AUDIO' ? 'ogg' : messageType === 'DOCUMENT' ? 'pdf' : 'jpg';
                    localMediaUrl = await this.downloadMediaFile(mediaId, token, ext);
                }
            }
            const incomingMessage = new this.waModel({
                leadId: matchedLeadId, patientPhone: cleanPhoneNum, sender: 'PATIENT',
                text, messageType, mediaId, mediaUrl: localMediaUrl, status: 'RECEIVED', isRead: false
            });
            await incomingMessage.save();
            this.logger.log(`✅ ${messageType} reply saved for Lead ID: ${matchedLeadId}`);
            return incomingMessage;
        }
        catch (error) {
            this.logger.error('Failed to save incoming message:', error.message);
        }
    }
    async handleIncoming(body) {
        try {
            const entry = body.entry?.[0];
            const changes = entry?.changes?.[0];
            const value = changes?.value;
            const targetPhoneId = value?.metadata?.phone_number_id;
            let targetHospitalId = null;
            if (targetPhoneId) {
                const hospital = await this.hospitalModel.findOne({ 'whatsappConfig.phoneId': targetPhoneId }).exec();
                if (hospital)
                    targetHospitalId = hospital._id.toString();
            }
            if (value?.messages && value.messages.length > 0) {
                const message = value.messages[0];
                const from = message.from;
                const type = message.type;
                let text = '';
                let messageType = 'TEXT';
                let mediaId = null;
                if (type === 'text')
                    text = message.text?.body;
                else if (type === 'image') {
                    messageType = 'IMAGE';
                    mediaId = message.image?.id;
                    text = message.image?.caption || '📷 Image received';
                }
                else if (type === 'video') {
                    messageType = 'VIDEO';
                    mediaId = message.video?.id;
                    text = message.video?.caption || '🎥 Video received';
                }
                else if (type === 'audio' || type === 'voice') {
                    messageType = 'AUDIO';
                    mediaId = message.audio?.id || message.voice?.id;
                    text = '🎤 Voice message received';
                }
                else if (type === 'document') {
                    messageType = 'DOCUMENT';
                    mediaId = message.document?.id;
                    text = message.document?.filename || '📄 Document received';
                }
                if (from && (text || mediaId)) {
                    this.logger.log(`📩 New incoming ${messageType} from ${from} directed to Hospital ${targetHospitalId}`);
                    return await this.saveIncomingMessage(targetHospitalId, from, text, messageType, mediaId);
                }
            }
            if (value?.statuses && value.statuses.length > 0) {
                const statusObj = value.statuses[0];
                const phone = statusObj.recipient_id;
                const newStatus = statusObj.status?.toUpperCase();
                if (phone && newStatus) {
                    const cleanPhoneNum = this.cleanPhone(phone);
                    await this.waModel.findOneAndUpdate({ patientPhone: { $in: [phone, cleanPhoneNum, `+${phone}`] }, sender: 'ERP' }, { $set: { status: newStatus } }, { sort: { createdAt: -1 } }).exec();
                }
                return { status: 'acknowledged' };
            }
            return { status: 'no_action' };
        }
        catch (error) {
            this.logger.error('Error parsing Meta webhook:', error.message);
            return { error: 'Failed to process' };
        }
    }
    async getHistory(leadId) {
        await this.waModel.updateMany({ leadId, sender: 'PATIENT', isRead: false }, { $set: { isRead: true } }).exec();
        return await this.waModel.find({ leadId }).sort({ createdAt: 1 }).exec();
    }
    async sendPatientInvoiceWhatsapp(hospitalId, phone, pdfBuffer, clinicName) {
        try {
            const hospital = await this.hospitalModel.findById(hospitalId).exec();
            const globalSettings = await this.settingsService.getGlobalSettings();
            const token = (hospital?.whatsappConfig?.accessToken || globalSettings?.defaultWhatsAppToken)?.trim();
            const phoneId = (hospital?.whatsappConfig?.phoneId || globalSettings?.defaultWhatsAppPhoneId)?.trim();
            if (!token || !phoneId) {
                throw new common_1.BadRequestException("WhatsApp API keys are missing for this clinic.");
            }
            let formattedPhone = String(phone).replace(/\D/g, '');
            if (formattedPhone.length === 10)
                formattedPhone = `91${formattedPhone}`;
            const formData = new form_data_1.default();
            formData.append('file', pdfBuffer, { filename: `Invoice.pdf`, contentType: 'application/pdf' });
            formData.append('messaging_product', 'whatsapp');
            const uploadRes = await axios_1.default.post(`https://graph.facebook.com/v22.0/${phoneId}/media`, formData, {
                headers: { ...formData.getHeaders(), Authorization: `Bearer ${token}` }
            });
            const mediaId = uploadRes.data.id;
            await axios_1.default.post(`https://graph.facebook.com/v22.0/${phoneId}/messages`, {
                messaging_product: 'whatsapp',
                to: formattedPhone,
                type: 'document',
                document: {
                    id: mediaId,
                    caption: `Hello, please find your official invoice/discharge summary from ${clinicName} attached. Thank you!`,
                    filename: `${clinicName.replace(/\s+/g, '_')}_Invoice.pdf`
                }
            }, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
            this.logger.log(`✅ Invoice sent via WhatsApp to ${formattedPhone}`);
            return { success: true };
        }
        catch (error) {
            this.logger.error('Meta Invoice Send Error:', error.response?.data || error.message);
            throw new common_1.BadRequestException('Failed to send WhatsApp invoice. Please check API settings.');
        }
    }
    async sendVisitTicketWhatsapp(hospitalId, phone, pdfBuffer, clinicName, visitType, visitNumber) {
        try {
            const hospital = await this.hospitalModel.findById(hospitalId).exec();
            const globalSettings = await this.settingsService.getGlobalSettings();
            const token = (hospital?.whatsappConfig?.accessToken || globalSettings?.defaultWhatsAppToken)?.trim();
            const phoneId = (hospital?.whatsappConfig?.phoneId || globalSettings?.defaultWhatsAppPhoneId)?.trim();
            if (!token || !phoneId) {
                throw new common_1.BadRequestException("WhatsApp API keys are missing for this clinic.");
            }
            let formattedPhone = String(phone).replace(/\D/g, '');
            if (formattedPhone.length === 10)
                formattedPhone = `91${formattedPhone}`;
            const formData = new form_data_1.default();
            formData.append('file', pdfBuffer, { filename: 'Ticket.pdf', contentType: 'application/pdf' });
            formData.append('messaging_product', 'whatsapp');
            const uploadRes = await axios_1.default.post(`https://graph.facebook.com/v22.0/${phoneId}/media`, formData, {
                headers: { ...formData.getHeaders(), Authorization: `Bearer ${token}` }
            });
            const mediaId = uploadRes.data.id;
            const typeLabel = visitType === 'DAY_CARE' ? 'Day Care' : visitType;
            await axios_1.default.post(`https://graph.facebook.com/v22.0/${phoneId}/messages`, {
                messaging_product: 'whatsapp',
                to: formattedPhone,
                type: 'document',
                document: {
                    id: mediaId,
                    caption: `Your ${typeLabel} registration ticket from ${clinicName} — ${visitNumber}. Please keep this for your records.`,
                    filename: `${clinicName.replace(/\s+/g, '_')}_${typeLabel}_Ticket.pdf`
                }
            }, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
            this.logger.log(`✅ Visit ticket sent via WhatsApp to ${formattedPhone}`);
            return { success: true };
        }
        catch (error) {
            this.logger.error('Meta Ticket Send Error:', error.response?.data || error.message);
            throw new common_1.BadRequestException('Failed to send WhatsApp ticket. Please check API settings.');
        }
    }
    async sendAppointmentConfirmation(hospitalId, phone, patientName, doctorName, dateStr, timeStr) {
        try {
            const hospital = await this.hospitalModel.findById(hospitalId).exec();
            const globalSettings = await this.settingsService.getGlobalSettings();
            const token = (hospital?.whatsappConfig?.accessToken || globalSettings?.defaultWhatsAppToken)?.trim();
            const phoneId = (hospital?.whatsappConfig?.phoneId || globalSettings?.defaultWhatsAppPhoneId)?.trim();
            if (!token || !phoneId) {
                this.logger.error(`🚨 CRITICAL: Missing WhatsApp API keys for Hospital ID ${hospitalId}. Cannot send confirmation.`);
                return false;
            }
            let formattedPhone = String(phone).replace(/\D/g, '');
            if (formattedPhone.length === 10)
                formattedPhone = `91${formattedPhone}`;
            const payload = {
                messaging_product: "whatsapp",
                to: formattedPhone,
                type: "template",
                template: {
                    name: "appointment_confirmation",
                    language: { code: "en" },
                    components: [
                        {
                            type: "body",
                            parameters: [
                                { type: "text", text: patientName },
                                { type: "text", text: doctorName },
                                { type: "text", text: dateStr },
                                { type: "text", text: timeStr }
                            ]
                        }
                    ]
                }
            };
            await axios_1.default.post(`https://graph.facebook.com/v22.0/${phoneId}/messages`, payload, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } });
            this.logger.log(`✅ Appointment Confirmation WhatsApp successfully sent to ${formattedPhone}`);
            return true;
        }
        catch (error) {
            this.logger.error('Meta Template Send Error:', error.response?.data || error.message);
            return false;
        }
    }
};
exports.WhatsAppService = WhatsAppService;
exports.WhatsAppService = WhatsAppService = WhatsAppService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(whatsapp_message_schema_1.WhatsAppMessage.name)),
    __param(1, (0, mongoose_1.InjectModel)('Lead')),
    __param(2, (0, mongoose_1.InjectModel)(hospital_schema_1.Hospital.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        settings_service_1.SettingsService])
], WhatsAppService);
//# sourceMappingURL=whatsapp.service.js.map