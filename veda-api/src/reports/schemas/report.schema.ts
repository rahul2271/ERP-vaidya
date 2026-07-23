import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReportDocument = Report & Document;

@Schema({ timestamps: true })
export class Report {
  @Prop({ required: true })
  patientName: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  patientId: Types.ObjectId;

  @Prop({ required: true })
  testName: string;

  @Prop({ required: true, enum: ['READY', 'REVIEWED'], default: 'READY' })
  status: string;

  @Prop()
  resultSummary: string; // Brief text result

  @Prop({ required: true })
  hospitalId: string;
}

export const ReportSchema = SchemaFactory.createForClass(Report);