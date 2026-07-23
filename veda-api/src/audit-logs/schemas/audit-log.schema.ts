import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type AuditLogDocument = AuditLog & Document;

@Schema({ timestamps: true })
export class AuditLog {
  // 🚀 Existing Fields (Tweaked to be optional for generic logs like Login)
  @Prop({ type: Types.ObjectId, ref: 'Hospital', index: true })
  hospitalId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId; // The person who did the action

  @Prop({ required: true })
  action: string; // e.g., "LOGIN", "DELETED_APPOINTMENT", "UPDATED_BILL"

  @Prop()
  module?: string; // e.g., "AUTH", "BILLING", "PATIENTS"

  @Prop()
  details?: string; // e.g., "Changed amount from ₹1200 to ₹800"

  // 🚀 New Fields for Security & Tracking
  @Prop()
  ipAddress?: string; // Tracks where the action came from

  @Prop({ type: MongooseSchema.Types.Mixed }) 
  targetId?: any; // ID of the specific document changed (e.g., Patient ID)

  @Prop({ type: MongooseSchema.Types.Mixed })
  oldData?: any; // The state of the data BEFORE the change

  @Prop({ type: MongooseSchema.Types.Mixed })
  newData?: any; // The state of the data AFTER the change
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);