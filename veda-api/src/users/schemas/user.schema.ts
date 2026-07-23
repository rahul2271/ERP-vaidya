import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ type: Types.ObjectId, ref: 'Hospital', required: true, index: true })
  hospitalId: Types.ObjectId; 

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string; 

  // ✅ FIX: Manually allowing ALL variations to prevent Validation Error
  @Prop({ 
    required: true, 
    enum: [
      'super_admin', 'SUPER_ADMIN', 
      'admin', 'ADMIN', 
      'doctor', 'DOCTOR', 
      'therapist', 'THERAPIST', 
      'receptionist', 'RECEPTIONIST',
      'patient', 'PATIENT',
      'pharmacist', 'PHARMACIST',
      'telecaller', 'TELECALLER'
    ], 
    default: 'therapist' 
  })
  role: string;

  @Prop()
  specialization?: string; 

  @Prop({ default: true })
  isActive: boolean;

  // 🚀 FIX: Force new staff to be available & restrict to valid statuses
  @Prop({ 
    type: String,
    enum: ['AVAILABLE', 'BUSY', 'OFFLINE'],
    default: 'AVAILABLE' 
  })
  attendanceStatus: string;

  // 🚀 NEW: Added Premium status for WhatsApp & advanced features
  @Prop({ default: false })
  isPremium: boolean;

  // 🚀 NEW: Granular Staff Permissions
  @Prop({ 
    type: Object, 
    default: { 
      canViewFinancials: true, 
      canEditInventory: true, 
      canExportData: false 
    } 
  })
  permissions: {
    canViewFinancials: boolean;
    canEditInventory: boolean;
    canExportData: boolean;
  };
}

export const UserSchema = SchemaFactory.createForClass(User);