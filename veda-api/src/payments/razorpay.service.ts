import { Injectable, Logger } from '@nestjs/common';
import Razorpay from 'razorpay';
import { SettingsService } from '../settings/settings.service';

// Pricing in INR (whole rupees) — single source of truth for what each plan
// costs. Must match the homepage's advertised prices in HomeClient.tsx exactly,
// or customers get charged a different amount than what they saw on the pricing page.
export const PLAN_PRICING: Record<string, Record<string, number>> = {
  BASIC: { monthly: 2499, annually: 24990 },
  PREMIUM: { monthly: 5999, annually: 59990 },
};

@Injectable()
export class RazorpayService {
  private readonly logger = new Logger(RazorpayService.name);

  constructor(private readonly settingsService: SettingsService) {}

  async createOrder(hospitalId: string, plan: string, billingCycle: 'monthly' | 'annually' = 'monthly') {
    const settings = await this.settingsService.getGlobalSettings();

    if (!settings.razorpayKey) {
      throw new Error('Razorpay Key is missing in Global Settings. Add it before enabling upgrades.');
    }
    if (!process.env.RAZORPAY_SECRET) {
      throw new Error('RAZORPAY_SECRET is not set in the environment.');
    }

    const amount = PLAN_PRICING[plan]?.[billingCycle];
    if (!amount) {
      throw new Error(`Unknown plan/cycle combination: "${plan}" / "${billingCycle}".`);
    }

    const instance = new Razorpay({
      key_id: settings.razorpayKey,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const options = {
      amount: amount * 100, // paise
      currency: "INR",
      receipt: `receipt_hosp_${hospitalId}_${Date.now()}`,
      // Critical: the webhook reads these back to know which hospital/plan/cycle
      // to activate. Without this, a successful payment has no way to be applied.
      notes: { hospitalId, plan, billingCycle },
    };

    const order = await instance.orders.create(options);
    return { ...order, razorpayKeyId: settings.razorpayKey, plan, billingCycle, amount };
  }
}