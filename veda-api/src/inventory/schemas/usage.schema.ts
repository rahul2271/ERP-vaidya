import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class InventoryUsage extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Inventory', required: true })
  inventoryId: Types.ObjectId; // Which medicine was used

  @Prop({ type: Types.ObjectId, ref: 'Appointment', required: true })
  appointmentId: Types.ObjectId; // Linked to which patient session

  @Prop({ required: true })
  quantityUsed: number;

  @Prop({ type: Types.ObjectId, ref: 'Hospital', required: true })
  hospitalId: Types.ObjectId; // Safety for Yukti Herbs isolation
}

export const InventoryUsageSchema = SchemaFactory.createForClass(InventoryUsage);