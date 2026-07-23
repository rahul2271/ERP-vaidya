import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TreatmentDocument = Treatment & Document;

@Schema({ timestamps: true })
export class Treatment {
  @Prop({ type: Types.ObjectId, ref: 'Hospital', required: true })
  hospitalId: Types.ObjectId;

  @Prop({ required: true })
  name: string; // e.g., "Abhyangam"

  @Prop({ required: true })
  cost: number; // e.g., 800

  @Prop({ default: 60 })
  durationMin: number; // e.g., 45 mins

  @Prop({ default: true })
  isActive: boolean;
}

export const TreatmentSchema = SchemaFactory.createForClass(Treatment);