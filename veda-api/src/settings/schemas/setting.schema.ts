// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document } from 'mongoose';

// export type SettingDocument = Setting & Document;

// @Schema({ timestamps: true })
// export class Setting {
//   // --- GENERAL ---
//   @Prop({ default: 'VAIDYA ERP' })
//   platformName: string;

//   @Prop({ default: 'support@vaidyaerp.com' })
//   supportEmail: string;

//   @Prop({ default: '+91 9876543210' })
//   supportPhone: string;

//   @Prop({ default: 'Asia/Kolkata' })
//   timeZone: string;

//   // --- INTEGRATIONS ---
//   @Prop({ default: '' })
//   smsApiKey: string;

//   @Prop({ default: '' })
//   smtpHost: string;

//   @Prop({ default: '587' })
//   smtpPort: string;

//   @Prop({ default: '' })
//   smtpUser: string;

//   @Prop({ default: '' })
//   smtpPass: string;

//   @Prop({ default: '' })
//   razorpayKey: string;

//   // --- SYSTEM & SECURITY ---
//   @Prop({ default: false })
//   maintenanceMode: boolean;

//   @Prop({ default: 5 })
//   maxLoginAttempts: number;

//   @Prop({ default: 120 })
//   sessionTimeoutMins: number;
// }

// export const SettingSchema = SchemaFactory.createForClass(Setting);

// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document } from 'mongoose';

// export type SettingDocument = Setting & Document;

// @Schema({ timestamps: true })
// export class Setting {
//   // --- GENERAL ---
//   @Prop({ default: 'VAIDYA ERP' })
//   platformName: string;

//   @Prop({ default: 'support@vaidyaerp.com' })
//   supportEmail: string;

//   @Prop({ default: '+91 9876543210' })
//   supportPhone: string;

//   @Prop({ default: 'Asia/Kolkata' })
//   timeZone: string;

//   // --- INTEGRATIONS ---
//   @Prop({ default: '' })
//   smsApiKey: string;

//   @Prop({ default: '' })
//   smtpHost: string;

//   @Prop({ default: '587' })
//   smtpPort: string;

//   @Prop({ default: '' })
//   smtpUser: string;

//   @Prop({ default: '' })
//   smtpPass: string;

//   @Prop({ default: '' })
//   razorpayKey: string;

//   // 🚀 SYSTEM-WIDE WHATSAPP DEFAULTS (SaaS Fallback)
//   @Prop({ default: '' })
//   defaultWhatsAppToken: string;

//   @Prop({ default: '' })
//   defaultWhatsAppPhoneId: string;

//   @Prop({ default: 'veda_erp_secure_token_123' })
//   defaultWhatsAppVerifyToken: string;

//   // --- SYSTEM & SECURITY ---
//   @Prop({ default: false })
//   maintenanceMode: boolean;

//   @Prop({ default: 5 })
//   maxLoginAttempts: number;

//   @Prop({ default: 120 })
//   sessionTimeoutMins: number;
// }

// export const SettingSchema = SchemaFactory.createForClass(Setting);


import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SettingDocument = Setting & Document;

@Schema({ timestamps: true })
export class Setting {
  // --- GENERAL ---
  @Prop({ default: 'VAIDYA ERP' })
  platformName: string;

  @Prop({ default: 'support@vaidyaerp.com' })
  supportEmail: string;

  @Prop({ default: '+91 9876543210' })
  supportPhone: string;

  @Prop({ default: 'Asia/Kolkata' })
  timeZone: string;

  // --- INTEGRATIONS ---
  @Prop({ default: '' })
  smsApiKey: string;

  @Prop({ default: '' })
  smtpHost: string;

  @Prop({ default: '587' })
  smtpPort: string;

  @Prop({ default: '' })
  smtpUser: string;

  @Prop({ default: '' })
  smtpPass: string;

  @Prop({ default: '' })
  razorpayKey: string;

  // 🚀 SYSTEM-WIDE WHATSAPP DEFAULTS (SaaS Fallback)
  @Prop({ default: '' })
  defaultWhatsAppToken: string;

  @Prop({ default: '' })
  defaultWhatsAppPhoneId: string;

  @Prop({ default: 'veda_erp_secure_token_123' })
  defaultWhatsAppVerifyToken: string;

  // --- SYSTEM & SECURITY ---
  @Prop({ default: false })
  maintenanceMode: boolean;

  @Prop({ default: 5 })
  maxLoginAttempts: number;

  @Prop({ default: 120 })
  sessionTimeoutMins: number;
}

export const SettingSchema = SchemaFactory.createForClass(Setting);
