import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Hospital } from '../../hospitals/schemas/hospital.schema';
import { User } from '../../users/schemas/user.schema'; 

export type PatientDocument = Patient & Document;

@Schema({ timestamps: true })
export class Patient {
  @Prop({ type: Types.ObjectId, ref: 'Hospital', required: true, index: true })
  hospitalId: Hospital | Types.ObjectId; 

  // 🚀 FIX: Added the UHID field so TypeScript and MongoDB know it exists!
  @Prop({ type: String })
  uhid?: string;

  // 🚀 FIX 1: Made required: false and added the optional ? operator
  @Prop({ type: Types.ObjectId, ref: 'User', required: false, index: true })
  assignedDoctorId?: User | Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  mobile: string; 

  @Prop({ required: true })
  age: number;

  // 🚀 FIX 2: Updated the enum to accept the full words from your frontend dropdown
  @Prop({ required: true, enum: ['Male', 'Female', 'Other', 'M', 'F', 'O'] })
  gender: string;

  @Prop()
  address: string;

  @Prop()
  prakriti: string; 

  @Prop([String])
  medicalHistory: string[]; 

  @Prop()
  chiefComplaints: string; 

  @Prop()
  diagnosis: string; 

  // ==================================================================
  // 🚀 NEW: DIGITAL PRAKRITI ASSESSMENT FIELDS
  // ==================================================================
  
  // 1. Temporary Secure Token for the Public WhatsApp Link
  @Prop()
  prakritiToken?: string;

  // 2. Final Calculated Dosha Percentages
  @Prop({ type: Object })
  prakritiScores?: {
    vata: number;
    pitta: number;
    kapha: number;
  };
}

export const PatientSchema = SchemaFactory.createForClass(Patient);

// Ensure mobile number is unique PER HOSPITAL (Multi-tenant safety)
PatientSchema.index({ hospitalId: 1, mobile: 1 }, { unique: true });

// 🚀 Ensure UHID is unique per hospital (sparse allows null values for old patients)
PatientSchema.index({ hospitalId: 1, uhid: 1 }, { unique: true, sparse: true });