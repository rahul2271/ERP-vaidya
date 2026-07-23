import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CounterDocument = Counter & Document;

// Backs every sequential number in the system — UHID, OPD, IPD, Day Care.
// One document per (hospital, type, year); `seq` increments atomically via
// findOneAndUpdate($inc), which is safe under concurrent bookings, unlike
// counting existing documents + 1 (race-condition prone) or Math.random() (collision-prone).
@Schema({ timestamps: true })
export class Counter {
  @Prop({ type: Types.ObjectId, ref: 'Hospital', required: true, index: true })
  hospitalId: Types.ObjectId;

  @Prop({ required: true, enum: ['UHID', 'OPD', 'IPD', 'DAY_CARE'] })
  type: string;

  @Prop({ required: true })
  year: number;

  @Prop({ required: true, default: 0 })
  seq: number;
}

export const CounterSchema = SchemaFactory.createForClass(Counter);
CounterSchema.index({ hospitalId: 1, type: 1, year: 1 }, { unique: true });
