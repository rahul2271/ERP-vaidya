import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class InventoryHistory extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Inventory', required: true })
  inventoryId: Types.ObjectId;

  @Prop({ required: true })
  changeType: 'ADDITION' | 'DEDUCTION';

  @Prop({ required: true })
  quantity: number;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  performedBy: Types.ObjectId; // Tracks the therapist or admin

  @Prop()
  notes: string; // e.g., "Used in Shirodhara for Patient Rahul"

  @Prop({ type: Types.ObjectId, ref: 'Hospital', required: true })
  hospitalId: Types.ObjectId;
}

export const InventoryHistorySchema = SchemaFactory.createForClass(InventoryHistory);