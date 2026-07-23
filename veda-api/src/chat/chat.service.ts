import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './schemas/message.schema';

@Injectable()
export class ChatService {
  constructor(@InjectModel(Message.name) private messageModel: Model<Message>) {}

  async saveMessage(senderId: string, senderName: string, senderRole: string, text: string, channelId: string) {
    const newMessage = new this.messageModel({ senderId, senderName, senderRole, text, channelId });
    return newMessage.save();
  }

  async getChatHistory(userId: string, role: string) {
    // 1. Fetch only relevant messages
    const messages = await this.messageModel.find({
      $or: [
        { channelId: 'GLOBAL' },           // Public Global Channel
        { channelId: role },               // Their Specific Role Channel
        { channelId: userId },             // DMs sent exactly TO them
        { senderId: userId }               // DMs sent BY them
      ]
    })
    .sort({ createdAt: -1 }) // Get newest first
    .limit(100)
    .exec();

    // 2. Reverse so oldest is at the top of the chat window
    return messages.reverse();
  }
}