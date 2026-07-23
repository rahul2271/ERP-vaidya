import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TherapyDocument = Therapy & Document;

@Schema({ timestamps: true })
export class Therapy {
  @Prop({ required: true })
  patientName: string;

  @Prop({ type: Types.ObjectId, ref: 'User' }) // Links to the Patient
  patientId: Types.ObjectId;

  @Prop({ required: true })
  therapyName: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) // Links to the Therapist
  therapistId: Types.ObjectId;

  @Prop()
  roomNumber: string;

  @Prop({ required: true })
  date: Date; // The day of the therapy

  @Prop()
  time: string; // e.g., "10:30 AM"

  @Prop({ required: true, enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'], default: 'PENDING' })
  status: string;

  @Prop({ required: true })
  hospitalId: string;
}

export const TherapySchema = SchemaFactory.createForClass(Therapy);