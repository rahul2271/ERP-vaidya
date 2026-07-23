import { Model } from 'mongoose';
import { Message } from './schemas/message.schema';
export declare class ChatService {
    private messageModel;
    constructor(messageModel: Model<Message>);
    saveMessage(senderId: string, senderName: string, senderRole: string, text: string, channelId: string): Promise<import("mongoose").Document<unknown, {}, Message, {}, import("mongoose").DefaultSchemaOptions> & Message & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getChatHistory(userId: string, role: string): Promise<(import("mongoose").Document<unknown, {}, Message, {}, import("mongoose").DefaultSchemaOptions> & Message & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
}
