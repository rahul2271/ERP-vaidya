import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LeadDocument = Lead & Document;

@Schema({ timestamps: true })
export class Lead {
  @Prop({ type: Types.ObjectId, ref: 'Hospital', required: true })
  hospitalId: Types.ObjectId;

  @Prop({ required: true })
  patientName: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ default: 'Facebook Ads' })
  source: string; // Campaign Name, FB Ads, Google Ads, etc.

  // 🚀 Tracks where the lead is in the funnel
  @Prop({ 
    enum: ['NEW', 'ASSIGNED', 'CONTACTED', 'BOOKED', 'NOT_INTERESTED'], 
    default: 'NEW' 
  })
  status: string;

  // 🚀 The Telecaller this lead is assigned to
  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  assignedTo: Types.ObjectId;

  // 🚀 Notes the telecaller collects before booking the doctor
  @Prop({ default: "" })
  medicalHistoryNotes: string;

  // If they successfully book, link the created patient ID here
  @Prop({ type: Types.ObjectId, ref: 'Patient', default: null })
  convertedPatientId: Types.ObjectId;

  // Add these inside your Lead class:
  @Prop({ default: "Unspecified" })
  preferredDoctor: string;

  @Prop({ default: "" })
  problem: string;

  @Prop({ default: "" })
  city: string;
}



export const LeadSchema = SchemaFactory.createForClass(Lead);