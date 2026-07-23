import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AppointmentDocument = Appointment & Document;

@Schema({ timestamps: true })
export class Appointment {
  @Prop({ type: Types.ObjectId, ref: 'Hospital', required: true, index: true })
  hospitalId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Patient', required: true })
  patientId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  doctorId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  therapistId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Room', required: true })
  roomId: Types.ObjectId;

  // 🚀 NEW: God Mode Audit - Tracks WHICH telecaller/receptionist booked this
  @Prop({ type: Types.ObjectId, ref: 'User' })
  bookedById: Types.ObjectId;

  @Prop({ required: true })
  treatmentName: string; 

  @Prop({ required: true })
  startTime: Date;

  @Prop({ required: true })
  endTime: Date;

  @Prop({ 
    default: 'SCHEDULED', 
    enum: ['SCHEDULED', 'WAITING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'BOOKED'] 
  })
  status: string;

  @Prop({ 
    default: 'PENDING', 
    enum: ['PENDING', 'PAID', 'PARTIAL'] 
  })
  paymentStatus: string;

  @Prop({ 
    default: 'UNPAID', 
    enum: ['UNPAID', 'CASH', 'UPI', 'CARD', 'BANK_TRANSFER'] 
  })
  paymentMode: string;

  @Prop({ default: 0 })
  amount: number;

  @Prop({ default: 0 })
  finalBilledAmount: number;

  @Prop({ 
    type: {
      percentage: { type: Number, default: 0 },
      amount: { type: Number, default: 0 }
    }, 
    default: { percentage: 0, amount: 0 },
    _id: false 
  })
  discount: {
    percentage: number;
    amount: number;
  };

  @Prop([{
    inventoryId: { type: Types.ObjectId, ref: 'Inventory', required: true },
    quantity: { type: Number, required: true, min: 1 },
    priceAtTime: { type: Number, default: 0 } 
  }])
  medicinesUsed: { 
      inventoryId: Types.ObjectId; 
      quantity: number; 
      priceAtTime?: number;
  }[];

  @Prop({
    type: {
      preBp: { type: String, default: 'N/A' },
      postBp: { type: String, default: 'N/A' },
      pulse: { type: String, default: 'N/A' },
      weight: { type: String, default: 'N/A' }, 
      notes: { type: String, default: '' },
    },
    default: {},
    _id: false
  })
  vitals: {
    preBp: string;
    postBp: string;
    pulse: string;
    weight: string;
    notes: string;
  };

  // 🚀 CLINICAL NARRATIVE
  @Prop({ default: "" })
  chiefComplaints: string;

  @Prop({ default: "" })
  diagnosis: string;

  @Prop({ type: String, default: null })
  nextFollowUpDate: string;

  @Prop({
    type: [{
      treatmentName: { type: String, required: true },
      notes: { type: String, default: "" },
      estimatedCost: { type: Number, default: 0 },
      isProcessed: { type: Boolean, default: false }
    }],
    default: [] 
  })
  recommendedTherapies: {
    treatmentName: string;
    notes: string;
    estimatedCost: number;
    isProcessed: boolean;
  }[];

  @Prop()
  room: string; 

  @Prop({ enum: ['IN_PERSON', 'ONLINE'], default: 'IN_PERSON' })
  mode: string;

  @Prop({ default: "" })
  meetLink: string;

  // ✅ OPD / IPD / DAY CARE REGISTRATION TRACKING
  // A visit starts as OPD by default. It can later be admitted to IPD or Day
  // Care via the admit endpoint, which generates a new number for the new type
  // while keeping the original OPD number for traceability — the patient's UHID
  // never changes across any of this.
  @Prop({ enum: ['OPD', 'IPD', 'DAY_CARE'], default: 'OPD' })
  visitType: string;

  @Prop({ type: String, default: null })
  opdNumber: string;

  @Prop({ type: String, default: null })
  ipdNumber: string;

  @Prop({ type: String, default: null })
  dayCareNumber: string;

  @Prop({ type: Date, default: null })
  admissionDate: Date;

  @Prop({ type: Date, default: null })
  dischargeDate: Date;

  // ✅ NABH-mandated discharge summary elements: condition of the patient at
  // discharge and advice given, filled in by staff at the point of discharge.
  @Prop({ type: String, default: null })
  dischargeCondition: string;

  @Prop({ type: String, default: null })
  dischargeAdvice: string;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);

// 🚀 NO-CONFLICT LOGIC: This strict database index physically prevents 
// assigning the same doctor to two different patients at the exact same start time.
AppointmentSchema.index({ doctorId: 1, startTime: 1 }, { unique: true });