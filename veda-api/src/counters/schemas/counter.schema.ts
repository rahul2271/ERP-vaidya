import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CounterDocument = Counter & Document;

// A tiny per-hospital, per-series sequence counter (UHID/OPD/IPD/DAY_CARE).
// Using an atomic $inc via findOneAndUpdate (see counters.service.ts) means two
// simultaneous registrations can never be handed the same number — unlike the
// previous random-number UHID generator, which had a real (if small) collision risk.
@Schema({ timestamps: true })
export class Counter {
  @Prop({ type: Types.ObjectId, ref: 'Hospital', required: true, index: true })
  hospitalId: Types.ObjectId;

  @Prop({ required: true, enum: ['UHID', 'OPD', 'IPD', 'DAY_CARE'] })
  series: string;

  @Prop({ required: true, default: 0 })
  seq: number;
}

export const CounterSchema = SchemaFactory.createForClass(Counter);
CounterSchema.index({ hospitalId: 1, series: 1 }, { unique: true });
