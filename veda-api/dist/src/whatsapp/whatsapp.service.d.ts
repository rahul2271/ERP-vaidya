import { Model } from 'mongoose';
import { WhatsAppMessage } from './schemas/whatsapp-message.schema';
import { Hospital } from '../hospitals/schemas/hospital.schema';
import { SettingsService } from '../settings/settings.service';
export declare class WhatsAppService {
    private readonly waModel;
    private readonly leadModel;
    private readonly hospitalModel;
    private readonly settingsService;
    private readonly logger;
    constructor(waModel: Model<WhatsAppMessage>, leadModel: Model<any>, hospitalModel: Model<Hospital>, settingsService: SettingsService);
    private cleanPhone;
    logAndSendMessage(hospitalId: string, leadId: string, phone: string, text: string, sender: string): Promise<import("mongoose").Document<unknown, {}, WhatsAppMessage, {}, import("mongoose").DefaultSchemaOptions> & WhatsAppMessage & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    logAndSendMedia(hospitalId: string, leadId: string, phone: string, file: Express.Multer.File, caption: string, sender: string): Promise<import("mongoose").Document<unknown, {}, WhatsAppMessage, {}, import("mongoose").DefaultSchemaOptions> & WhatsAppMessage & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    downloadMediaFile(mediaId: string, token: string, extension?: string): Promise<string | null>;
    saveIncomingMessage(hospitalId: string | null, phone: string, text: string, messageType?: string, mediaId?: string | null): Promise<(import("mongoose").Document<unknown, {}, WhatsAppMessage, {}, import("mongoose").DefaultSchemaOptions> & WhatsAppMessage & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | undefined>;
    handleIncoming(body: any): Promise<(import("mongoose").Document<unknown, {}, WhatsAppMessage, {}, import("mongoose").DefaultSchemaOptions> & WhatsAppMessage & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | {
        status: string;
        error?: undefined;
    } | {
        error: string;
        status?: undefined;
    } | undefined>;
    getHistory(leadId: string): Promise<(import("mongoose").Document<unknown, {}, WhatsAppMessage, {}, import("mongoose").DefaultSchemaOptions> & WhatsAppMessage & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    sendPatientInvoiceWhatsapp(hospitalId: string, phone: string, pdfBuffer: Buffer, clinicName: string): Promise<{
        success: boolean;
    }>;
    sendVisitTicketWhatsapp(hospitalId: string, phone: string, pdfBuffer: Buffer, clinicName: string, visitType: string, visitNumber: string): Promise<{
        success: boolean;
    }>;
    sendAppointmentConfirmation(hospitalId: string, phone: string, patientName: string, doctorName: string, dateStr: string, timeStr: string): Promise<boolean>;
}
