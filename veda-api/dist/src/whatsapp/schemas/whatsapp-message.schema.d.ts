import { Document } from 'mongoose';
export declare class WhatsAppMessage extends Document {
    leadId: string;
    patientPhone: string;
    sender: string;
    messageType: string;
    text: string;
    mediaUrl: string;
    mediaId: string;
    status: string;
    isRead: boolean;
}
export declare const WhatsAppMessageSchema: import("mongoose").Schema<WhatsAppMessage, import("mongoose").Model<WhatsAppMessage, any, any, any, any, any, WhatsAppMessage>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, WhatsAppMessage, Document<unknown, {}, WhatsAppMessage, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<WhatsAppMessage & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    _id?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, WhatsAppMessage, Document<unknown, {}, WhatsAppMessage, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WhatsAppMessage & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    text?: import("mongoose").SchemaDefinitionProperty<string, WhatsAppMessage, Document<unknown, {}, WhatsAppMessage, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WhatsAppMessage & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<string, WhatsAppMessage, Document<unknown, {}, WhatsAppMessage, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WhatsAppMessage & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    leadId?: import("mongoose").SchemaDefinitionProperty<string, WhatsAppMessage, Document<unknown, {}, WhatsAppMessage, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WhatsAppMessage & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    patientPhone?: import("mongoose").SchemaDefinitionProperty<string, WhatsAppMessage, Document<unknown, {}, WhatsAppMessage, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WhatsAppMessage & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    sender?: import("mongoose").SchemaDefinitionProperty<string, WhatsAppMessage, Document<unknown, {}, WhatsAppMessage, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WhatsAppMessage & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    messageType?: import("mongoose").SchemaDefinitionProperty<string, WhatsAppMessage, Document<unknown, {}, WhatsAppMessage, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WhatsAppMessage & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    mediaUrl?: import("mongoose").SchemaDefinitionProperty<string, WhatsAppMessage, Document<unknown, {}, WhatsAppMessage, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WhatsAppMessage & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    mediaId?: import("mongoose").SchemaDefinitionProperty<string, WhatsAppMessage, Document<unknown, {}, WhatsAppMessage, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WhatsAppMessage & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    isRead?: import("mongoose").SchemaDefinitionProperty<boolean, WhatsAppMessage, Document<unknown, {}, WhatsAppMessage, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WhatsAppMessage & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, WhatsAppMessage>;
