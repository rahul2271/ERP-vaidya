// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document } from 'mongoose';

// @Schema({ timestamps: true })
// export class WhatsAppMessage extends Document {
//   @Prop({ required: true })
//   leadId: string; // The ID of the Lead or Patient

//   @Prop({ required: true })
//   patientPhone: string;

//   @Prop({ required: true, enum: ['ERP', 'PATIENT'] })
//   sender: string; // Did the Telecaller send it, or the Patient?

//   @Prop({ required: true })
//   text: string;

//   @Prop({ default: 'DELIVERED' })
//   status: string; // SENT, DELIVERED, READ

//   // 🚀 THE FIX: Tracks if the Telecaller has opened this message
//   @Prop({ default: false })
//   isRead: boolean;
// }

// export const WhatsAppMessageSchema = SchemaFactory.createForClass(WhatsAppMessage);


import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class WhatsAppMessage extends Document {
  @Prop({ required: true })
  leadId: string;

  @Prop({ required: true })
  patientPhone: string;

  @Prop({ required: true, enum: ['ERP', 'PATIENT'] })
  sender: string;

  // 🚀 Added Message Type
  @Prop({ default: 'TEXT', enum: ['TEXT', 'IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT'] })
  messageType: string;

  // Made text optional since an image might not have a caption
  @Prop({ required: false })
  text: string;

  // 🚀 Where we store the file URL or Meta's Media ID
  @Prop({ required: false })
  mediaUrl: string;

  @Prop({ required: false })
  mediaId: string;

  @Prop({ default: 'DELIVERED' })
  status: string;

  @Prop({ default: false })
  isRead: boolean;
}

export const WhatsAppMessageSchema = SchemaFactory.createForClass(WhatsAppMessage);