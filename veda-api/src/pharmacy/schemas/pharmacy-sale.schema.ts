import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PharmacySaleDocument = PharmacySale & Document;

@Schema({ timestamps: true })
export class PharmacySale {
  @Prop({ type: Types.ObjectId, ref: 'Hospital', required: true, index: true })
  hospitalId: Types.ObjectId;

  @Prop({ required: true })
  customerName: string;

  @Prop()
  customerPhone: string;

  @Prop({ type: Types.ObjectId, ref: 'Patient', default: null })
  patientId: Types.ObjectId;

  @Prop([{
    inventoryId: { type: Types.ObjectId, ref: 'Inventory', required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true },
    lineTotal: { type: Number, required: true }
  }])
  items: {
    inventoryId: Types.ObjectId;
    name: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }[];

  @Prop({ required: true })
  subtotal: number;

  @Prop({ 
    type: { percentage: { type: Number, default: 0 }, amount: { type: Number, default: 0 } }, 
    default: { percentage: 0, amount: 0 },
    _id: false 
  })
  discount: { percentage: number; amount: number; };

  @Prop({ required: true })
  grandTotal: number;

  @Prop({ required: true, enum: ['CASH', 'UPI', 'CARD'] })
  paymentMode: string;

  @Prop({ default: 'PAID' })
  paymentStatus: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  soldBy: Types.ObjectId;
}

export const PharmacySaleSchema = SchemaFactory.createForClass(PharmacySale);