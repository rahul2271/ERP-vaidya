import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Task extends Document {
  @Prop({ required: true })
  text: string;

  @Prop({ default: false })
  done: boolean;

  // This links the task specifically to the logged-in doctor
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  doctorId: Types.ObjectId; 
}

export const TaskSchema = SchemaFactory.createForClass(Task);