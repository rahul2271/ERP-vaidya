import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WhatsAppMessage } from './schemas/whatsapp-message.schema';
import { Hospital } from '../hospitals/schemas/hospital.schema';
import { SettingsService } from '../settings/settings.service'; 
import axios from 'axios'; 
import * as fs from 'fs';
import * as path from 'path';
import FormData from 'form-data';

@Injectable()
export class WhatsAppService {
  private readonly logger = new Logger(WhatsAppService.name);

  constructor(
    @InjectModel(WhatsAppMessage.name) private readonly waModel: Model<WhatsAppMessage>,
    @InjectModel('Lead') private readonly leadModel: Model<any>,
    @InjectModel(Hospital.name) private readonly hospitalModel: Model<Hospital>,
    private readonly settingsService: SettingsService 
  ) {}

  private cleanPhone(phone: string) {
    let cleaned = String(phone).replace(/\D/g, ''); 
    if (cleaned.startsWith('91') && cleaned.length === 12) {
      return cleaned.substring(2); 
    }
    return cleaned;
  }

  // 🚀 1. SEND TEXT MESSAGE (MULTI-TENANT)
  async logAndSendMessage(hospitalId: string, leadId: string, phone: string, text: string, sender: string) {
    if (!phone || !text || !leadId || !hospitalId) {
      throw new BadRequestException("Missing required fields for WhatsApp message.");
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
      if (formattedPhone.length === 10) formattedPhone = `91${formattedPhone}`;

      await axios.post(
        `https://graph.facebook.com/v22.0/${phoneId}/messages`,
        { messaging_product: 'whatsapp', to: formattedPhone, type: 'text', text: { body: text } },
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      
      this.logger.log(`✅ WhatsApp sent to ${formattedPhone}`);
      return savedMessage;
    } catch (error: any) {
      this.logger.error('Meta API Error:', error.response?.data || error.message);
      return savedMessage; 
    }
  }

  // 🚀 2. SEND MEDIA MESSAGE (MULTI-TENANT)
  async logAndSendMedia(hospitalId: string, leadId: string, phone: string, file: Express.Multer.File, caption: string, sender: string) {
    let formattedPhone = String(phone).replace(/\D/g, ''); 
    if (formattedPhone.length === 10) formattedPhone = `91${formattedPhone}`;

    try {
      const mimeType = file.mimetype;
      let messageType = 'DOCUMENT';
      let metaType = 'document';

      if (mimeType.startsWith('image/')) { messageType = 'IMAGE'; metaType = 'image'; } 
      else if (mimeType.startsWith('video/')) { messageType = 'VIDEO'; metaType = 'video'; }

      const hospital = await this.hospitalModel.findById(hospitalId).exec();
      const globalSettings = await this.settingsService.getGlobalSettings(); 
      
      const token = (hospital?.whatsappConfig?.accessToken || globalSettings?.defaultWhatsAppToken)?.trim();
      const phoneId = (hospital?.whatsappConfig?.phoneId || globalSettings?.defaultWhatsAppPhoneId)?.trim();

      if (!token || !phoneId) throw new Error("No WhatsApp token found!");

      const formData = new FormData();
      formData.append('file', file.buffer, { filename: file.originalname, contentType: file.mimetype });
      formData.append('messaging_product', 'whatsapp');

      const uploadResponse = await axios.post(`https://graph.facebook.com/v22.0/${phoneId}/media`, formData, {
        headers: { ...formData.getHeaders(), Authorization: `Bearer ${token}` }
      });

      const uploadedMediaId = uploadResponse.data.id;
      const messagePayload: any = { messaging_product: 'whatsapp', to: formattedPhone, type: metaType };

      if (metaType === 'document') {
        messagePayload.document = { id: uploadedMediaId, filename: file.originalname };
        if (caption) messagePayload.document.caption = caption;
      } else {
        messagePayload[metaType] = { id: uploadedMediaId };
        if (caption) messagePayload[metaType].caption = caption;
      }

      await axios.post(`https://graph.facebook.com/v22.0/${phoneId}/messages`, messagePayload, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      });

      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'whatsapp');
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
      
      const uniqueFileName = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
      fs.writeFileSync(path.join(uploadDir, uniqueFileName), file.buffer);

      const newMessage = new this.waModel({
        leadId, patientPhone: this.cleanPhone(phone), sender, text: caption || `Sent ${messageType}`,
        messageType, mediaId: uploadedMediaId, mediaUrl: `/uploads/whatsapp/${uniqueFileName}`, status: 'SENT'
      });
      
      return await newMessage.save();

    } catch (error: any) {
      this.logger.error('Meta Media Upload/Send Error:', error.response?.data || error.message);
      throw new Error("Failed to send media via Meta API");
    }
  }

  // 🚀 3. DOWNLOAD MEDIA
  async downloadMediaFile(mediaId: string, token: string, extension: string = 'jpg'): Promise<string | null> {
    try {
      const urlResponse = await axios.get(`https://graph.facebook.com/v22.0/${mediaId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const mediaUrl = urlResponse.data?.url;
      if (!mediaUrl) throw new Error("Meta API did not return a valid download URL.");

      const fileResponse = await axios.get(mediaUrl, {
        headers: { Authorization: `Bearer ${token}` }, responseType: 'arraybuffer' 
      });

      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'whatsapp');
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

      const fileName = `${mediaId}.${extension}`;
      fs.writeFileSync(path.join(uploadDir, fileName), Buffer.from(fileResponse.data));

      return `/uploads/whatsapp/${fileName}`; 
    } catch (error: any) {
      this.logger.error(`Failed to download media ${mediaId}`);
      return null;
    }
  }

  // 🚀 4. RECEIVE INCOMING MESSAGE (MULTI-TENANT ROUTING)
  async saveIncomingMessage(hospitalId: string | null, phone: string, text: string, messageType: string = 'TEXT', mediaId: string | null = null) {
    try {
      const cleanPhoneNum = this.cleanPhone(phone);
      const matchQuery: any = { 
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

      let localMediaUrl: string | null = null;
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
    } catch (error: any) {
      this.logger.error('Failed to save incoming message:', error.message);
    }
  }

  // 🚀 5. MAIN WEBHOOK HANDLER
  async handleIncoming(body: any) {
    try {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;

      const targetPhoneId = value?.metadata?.phone_number_id;
      let targetHospitalId: string | null = null; 

      if (targetPhoneId) {
        const hospital = await this.hospitalModel.findOne({ 'whatsappConfig.phoneId': targetPhoneId }).exec();
        if (hospital) targetHospitalId = hospital._id.toString(); 
      }

      if (value?.messages && value.messages.length > 0) {
        const message = value.messages[0];
        const from = message.from; 
        const type = message.type; 

        let text = '';
        let messageType = 'TEXT';
        let mediaId: string | null = null; 

        if (type === 'text') text = message.text?.body;
        else if (type === 'image') { messageType = 'IMAGE'; mediaId = message.image?.id; text = message.image?.caption || '📷 Image received'; }
        else if (type === 'video') { messageType = 'VIDEO'; mediaId = message.video?.id; text = message.video?.caption || '🎥 Video received'; }
        else if (type === 'audio' || type === 'voice') { messageType = 'AUDIO'; mediaId = message.audio?.id || message.voice?.id; text = '🎤 Voice message received'; }
        else if (type === 'document') { messageType = 'DOCUMENT'; mediaId = message.document?.id; text = message.document?.filename || '📄 Document received'; }

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
          await this.waModel.findOneAndUpdate(
            { patientPhone: { $in: [phone, cleanPhoneNum, `+${phone}`] }, sender: 'ERP' },
            { $set: { status: newStatus } },
            { sort: { createdAt: -1 } } 
          ).exec();
        }
        return { status: 'acknowledged' };
      }
      return { status: 'no_action' };
    } catch (error: any) {
      this.logger.error('Error parsing Meta webhook:', error.message);
      return { error: 'Failed to process' };
    }
  }

  async getHistory(leadId: string) {
    await this.waModel.updateMany({ leadId, sender: 'PATIENT', isRead: false }, { $set: { isRead: true } }).exec();
    return await this.waModel.find({ leadId }).sort({ createdAt: 1 }).exec();
  }

  // 🚀 6. SEND INVOICE PDF TO PATIENT VIA META API
  async sendPatientInvoiceWhatsapp(hospitalId: string, phone: string, pdfBuffer: Buffer, clinicName: string) {
    try {
      const hospital = await this.hospitalModel.findById(hospitalId).exec();
      const globalSettings = await this.settingsService.getGlobalSettings();

      const token = (hospital?.whatsappConfig?.accessToken || globalSettings?.defaultWhatsAppToken)?.trim();
      const phoneId = (hospital?.whatsappConfig?.phoneId || globalSettings?.defaultWhatsAppPhoneId)?.trim();

      if (!token || !phoneId) {
        throw new BadRequestException("WhatsApp API keys are missing for this clinic.");
      }

      let formattedPhone = String(phone).replace(/\D/g, '');
      if (formattedPhone.length === 10) formattedPhone = `91${formattedPhone}`;

      // Step A: Upload PDF to Meta
      const formData = new FormData();
      formData.append('file', pdfBuffer, { filename: `Invoice.pdf`, contentType: 'application/pdf' });
      formData.append('messaging_product', 'whatsapp');

      const uploadRes = await axios.post(`https://graph.facebook.com/v22.0/${phoneId}/media`, formData, {
        headers: { ...formData.getHeaders(), Authorization: `Bearer ${token}` }
      });

      const mediaId = uploadRes.data.id;

      // Step B: Send Document Message
      await axios.post(`https://graph.facebook.com/v22.0/${phoneId}/messages`, {
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

    } catch (error: any) {
      this.logger.error('Meta Invoice Send Error:', error.response?.data || error.message);
      throw new BadRequestException('Failed to send WhatsApp invoice. Please check API settings.');
    }
  }

  // =========================================================================
  // 🚀 SEND OPD/IPD/DAY CARE TICKET (same Meta upload+send flow as invoices,
  // but with ticket-appropriate messaging)
  // =========================================================================
  async sendVisitTicketWhatsapp(hospitalId: string, phone: string, pdfBuffer: Buffer, clinicName: string, visitType: string, visitNumber: string) {
    try {
      const hospital = await this.hospitalModel.findById(hospitalId).exec();
      const globalSettings = await this.settingsService.getGlobalSettings();

      const token = (hospital?.whatsappConfig?.accessToken || globalSettings?.defaultWhatsAppToken)?.trim();
      const phoneId = (hospital?.whatsappConfig?.phoneId || globalSettings?.defaultWhatsAppPhoneId)?.trim();

      if (!token || !phoneId) {
        throw new BadRequestException("WhatsApp API keys are missing for this clinic.");
      }

      let formattedPhone = String(phone).replace(/\D/g, '');
      if (formattedPhone.length === 10) formattedPhone = `91${formattedPhone}`;

      const formData = new FormData();
      formData.append('file', pdfBuffer, { filename: 'Ticket.pdf', contentType: 'application/pdf' });
      formData.append('messaging_product', 'whatsapp');

      const uploadRes = await axios.post(`https://graph.facebook.com/v22.0/${phoneId}/media`, formData, {
        headers: { ...formData.getHeaders(), Authorization: `Bearer ${token}` }
      });

      const mediaId = uploadRes.data.id;
      const typeLabel = visitType === 'DAY_CARE' ? 'Day Care' : visitType;

      await axios.post(`https://graph.facebook.com/v22.0/${phoneId}/messages`, {
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

    } catch (error: any) {
      this.logger.error('Meta Ticket Send Error:', error.response?.data || error.message);
      throw new BadRequestException('Failed to send WhatsApp ticket. Please check API settings.');
    }
  }

  // =========================================================================
  // 🚀 7. NEW: SEND APPOINTMENT CONFIRMATION (TEMPLATE API)
  // =========================================================================
  async sendAppointmentConfirmation(
    hospitalId: string, // Requires hospital ID to get the correct tenant token
    phone: string,
    patientName: string,
    doctorName: string,
    dateStr: string,
    timeStr: string
  ) {
    try {
      // 1. Fetch Dynamic Tenant Settings
      const hospital = await this.hospitalModel.findById(hospitalId).exec();
      const globalSettings = await this.settingsService.getGlobalSettings();

      const token = (hospital?.whatsappConfig?.accessToken || globalSettings?.defaultWhatsAppToken)?.trim();
      const phoneId = (hospital?.whatsappConfig?.phoneId || globalSettings?.defaultWhatsAppPhoneId)?.trim();

      if (!token || !phoneId) {
        this.logger.error(`🚨 CRITICAL: Missing WhatsApp API keys for Hospital ID ${hospitalId}. Cannot send confirmation.`);
        return false; // Returns false gracefully so booking flow doesn't crash
      }

      // 2. Format Phone Number for Meta
      let formattedPhone = String(phone).replace(/\D/g, '');
      if (formattedPhone.length === 10) formattedPhone = `91${formattedPhone}`;

      // 3. Build Template Payload (Matches Meta Business API spec)
      const payload = {
        messaging_product: "whatsapp",
        to: formattedPhone,
        type: "template",
        template: {
          name: "appointment_confirmation", // Replace this string with your EXACT Meta template name
          language: { code: "en" }, // Replace with "en_US" or "hi" depending on your template language
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: patientName }, // Variable {{1}}
                { type: "text", text: doctorName },  // Variable {{2}}
                { type: "text", text: dateStr },     // Variable {{3}}
                { type: "text", text: timeStr }      // Variable {{4}}
              ]
            }
          ]
        }
      };

      // 4. Send API Request
      await axios.post(
        `https://graph.facebook.com/v22.0/${phoneId}/messages`, 
        payload, 
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );

      this.logger.log(`✅ Appointment Confirmation WhatsApp successfully sent to ${formattedPhone}`);
      return true;

    } catch (error: any) {
      this.logger.error('Meta Template Send Error:', error.response?.data || error.message);
      return false; // Returns false gracefully
    }
  }
}