import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Message extends Document {
  @Prop({ required: true })
  senderId: string;

  @Prop({ required: true })
  senderName: string;

  @Prop({ required: true })
  senderRole: string;

  @Prop({ required: true })
  text: string;

  // 🚀 If it's a Channel, this will be 'GLOBAL', 'DOCTOR', etc.
  // 🚀 If it's a DM, this will be the Target User's ID.
  @Prop({ required: true })
  channelId: string; 
}

export const MessageSchema = SchemaFactory.createForClass(Message);