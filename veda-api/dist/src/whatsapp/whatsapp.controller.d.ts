import { WhatsAppService } from './whatsapp.service';
import { SettingsService } from '../settings/settings.service';
export declare class WhatsAppController {
    private readonly whatsappService;
    private readonly settingsService;
    constructor(whatsappService: WhatsAppService, settingsService: SettingsService);
    verifyWebhook(mode: string, token: string, challenge: string, res: any): any;
    handleWebhook(body: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/whatsapp-message.schema").WhatsAppMessage, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/whatsapp-message.schema").WhatsAppMessage & Required<{
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
    sendMessage(body: {
        leadId: string;
        phone: string;
        text: string;
    }, req: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/whatsapp-message.schema").WhatsAppMessage, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/whatsapp-message.schema").WhatsAppMessage & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    sendMediaMessage(file: Express.Multer.File, body: {
        leadId: string;
        phone: string;
        text?: string;
    }, req: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/whatsapp-message.schema").WhatsAppMessage, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/whatsapp-message.schema").WhatsAppMessage & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getChatHistory(leadId: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/whatsapp-message.schema").WhatsAppMessage, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/whatsapp-message.schema").WhatsAppMessage & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
}
