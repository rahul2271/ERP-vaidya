import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HospitalDocument = Hospital & Document;

@Schema({ timestamps: true })
export class Hospital {
  // ✅ Basic Information
  @Prop({ required: true })
  name: string; 

  // 🚀 PREMIUM FEATURE: Custom Hospital Logo URL
  @Prop({ default: "" })
  logo: string;

  // 🚀 NEW: Clinic Tagline (For Invoices)
  @Prop({ default: "" })
  tagline: string;

  // 🚀 NEW: Official Email
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  phone: string; 

  // 🚀 NEW: Full Physical Address
  @Prop({ default: "" })
  address: string;

  @Prop({ required: true })
  city: string; 

  @Prop({ required: true })
  state: string; 

  // 🚀 NEW: Legal & Taxation (Billing Fields)
  @Prop({ default: "" })
  gstNumber: string;

  @Prop({ default: "" })
  registrationNumber: string;

  // ✅ SaaS & Subscription Logic
  @Prop({ required: true, unique: true })
  domain: string; 

  @Prop({ required: true, enum: ['BASIC', 'PREMIUM'], default: 'BASIC' })
  plan: string;

  @Prop({ required: true, enum: ['Active', 'Inactive'], default: 'Active' })
  status: string;

  @Prop({ type: Date })
  subscriptionExpiry: Date; // Useful for auto-disabling features

  // ✅ SELF-SERVE TRIAL TRACKING
  // New signups start here: full PREMIUM features for 15 days, then must pay.
  @Prop({ required: true, enum: ['TRIALING', 'ACTIVE', 'TRIAL_EXPIRED'], default: 'TRIALING' })
  subscriptionStatus: string;

  @Prop({ type: Date })
  trialEndsAt: Date;

  // Set when a paid plan is activated (trial upgrade or renewal). Shown in the
  // dashboard as "Next billing date" — this is the actual real date, not a placeholder.
  // Note: this does not itself trigger a recurring charge — Razorpay's one-time
  // Orders API is what's wired up today. Real auto-renewal would need Razorpay's
  // Subscriptions API instead.
  @Prop({ type: Date })
  planRenewsAt: Date;

  @Prop({ enum: ['monthly', 'annually'], default: 'monthly' })
  billingCycle: string;

  // ✅ TALLY CONNECTOR (Multi-Tenant, Premium-only)
  // `serverUrl` points at wherever Tally's HTTP/XML server is reachable —
  // typically http://<lan-ip>:9000 on the same network as this backend, a
  // cloud-hosted Tally instance, or a tunnel (ngrok etc.) to a local install.
  // A standard local desktop Tally with no exposed port simply won't be
  // reachable here — that's a Tally networking fact, not something this
  // config can work around.
  @Prop({
    type: {
      serverUrl: { type: String, default: null },
      companyName: { type: String, default: null },
      lastSyncedAt: { type: Date, default: null },
      lastSyncStatus: { type: String, default: null },
    },
    _id: false,
    default: null,
  })
  tallyConfig: {
    serverUrl: string;
    companyName: string;
    lastSyncedAt: Date;
    lastSyncStatus: string;
  };

  // ✅ Hospital Configuration
  @Prop({ type: Object, default: { startTime: "09:00", endTime: "18:00" } })
  config: {
    startTime: string; 
    endTime: string;   
  };

  // ✅ WHATSAPP API CONFIGURATION (Multi-Tenant Support)
  // Each hospital will provide their own keys from Meta
  @Prop({
    type: {
      accessToken: { type: String, default: null },
      phoneId: { type: String, default: null },
      businessAccountId: { type: String, default: null },
      verifyToken: { type: String, default: null }, // Unique to this hospital's webhook
    },
    _id: false,
    default: null,
  })
  whatsappConfig: {
    accessToken: string;
    phoneId: string;
    businessAccountId: string;
    verifyToken: string;
  };

  // ✅ SMTP CONFIGURATION (Multi-Tenant Support)
  // Each hospital brings their own email sending credentials so patient-facing
  // emails (invoices, receipts) come from the clinic's own identity, not the platform's.
  @Prop({
    type: {
      host: { type: String, default: null },
      port: { type: Number, default: 587 },
      user: { type: String, default: null },
      pass: { type: String, default: null },
      fromEmail: { type: String, default: null },
      fromName: { type: String, default: null },
    },
    _id: false,
    default: null,
  })
  smtpConfig: {
    host: string;
    port: number;
    user: string;
    pass: string;
    fromEmail: string;
    fromName: string;
  };
}

export const HospitalSchema = SchemaFactory.createForClass(Hospital);