import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Hospital } from '../../hospitals/schemas/hospital.schema';
import { User } from '../../users/schemas/user.schema';

export type NoticeDocument = Notice & Document;

@Schema({ timestamps: true })
export class Notice {
  @Prop({ type: Types.ObjectId, ref: 'Hospital', required: true, index: true })
  hospitalId: Hospital | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  authorId: User | Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  // 🚀 Tracks if the Admin has approved it
  @Prop({ required: true, enum: ['PENDING', 'PUBLISHED', 'REJECTED'], default: 'PENDING' })
  status: string;
}

export const NoticeSchema = SchemaFactory.createForClass(Notice);