import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Inventory extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, default: 'General' }) // Matches your frontend categories
  category: string;

  // ✅ CHANGED: Renamed from 'stock' to 'quantity' to match your frontend logic
  @Prop({ required: true, default: 0 })
  quantity: number;

  @Prop({ required: true })
  unit: string;

  // ✅ CHANGED: Renamed from 'pricePerUnit' to 'price' to match your billing logic
  @Prop({ required: true, default: 0 })
  price: number;

  @Prop({ default: 5 }) // Added to support the 'Low Stock' alert logic
  minLevel: number;

  @Prop({ type: Types.ObjectId, ref: 'Hospital', required: true })
  hospitalId: Types.ObjectId; 
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);