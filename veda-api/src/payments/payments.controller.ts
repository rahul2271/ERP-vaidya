import { Controller, Post, Body, Headers, UseGuards, Request, BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';
import { RazorpayService, PLAN_PRICING } from './razorpay.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { HospitalsService } from '../hospitals/hospitals.service';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly razorpayService: RazorpayService,
    private readonly hospitalsService: HospitalsService,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
  ) {}

  // Self-serve upgrade: any logged-in hospital admin can start a checkout for
  // their own hospital. (Super Admin's internal plan toggle is separate and
  // doesn't go through payment at all — see /hospitals/:id PATCH.)
  // Used both by the in-dashboard Upgrade page and the homepage's "choose plan,
  // pay directly" flow right after signup — both are just an authenticated
  // hospital admin starting a checkout, so one endpoint covers it.
  @UseGuards(JwtAuthGuard)
  @Post('create-subscription')
  async startSubscription(@Body() body: { plan: string; billingCycle?: 'monthly' | 'annually' }, @Request() req: any) {
    const hospitalId = req.user?.hospitalId;
    if (!hospitalId) throw new BadRequestException('No hospital linked to your account.');
    return this.razorpayService.createOrder(hospitalId, body.plan, body.billingCycle || 'monthly');
  }

  @Post('webhook')
  async handleWebhook(
    @Body() body: any,
    @Headers('x-razorpay-signature') signature: string,
    @Request() req: any
  ) {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new BadRequestException('Webhook secret not configured on the server.');
    }
    if (!signature) {
      throw new BadRequestException('Missing signature.');
    }

    // Verify against the exact raw bytes Razorpay signed — NOT a re-serialized
    // JSON.stringify(body), which can differ in key order/whitespace and would
    // make every legitimate webhook fail verification. req.rawBody requires
    // `rawBody: true` on NestFactory.create (see main.ts).
    const rawBody: Buffer | undefined = req.rawBody;
    if (!rawBody) {
      throw new BadRequestException('Raw body unavailable for signature verification.');
    }

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      throw new BadRequestException('Invalid webhook signature.');
    }

    if (body.event === 'payment.captured') {
      const notes = body.payload?.payment?.entity?.notes || {};
      const { hospitalId, plan, billingCycle } = notes;
      const amountPaid = body.payload?.payment?.entity?.amount ? body.payload.payment.entity.amount / 100 : PLAN_PRICING[plan]?.[billingCycle || 'monthly'];

      if (hospitalId && plan) {
        const hospital = await this.hospitalsService.activatePaidPlan(hospitalId, plan, billingCycle || 'monthly');

        // Best-effort receipt email — payment is already confirmed and applied
        // regardless of whether this succeeds.
        try {
          const admin = await this.usersService.findAdminByHospitalId(hospitalId);
          if (admin?.email) {
            await this.mailService.sendSubscriptionReceiptEmail(
              admin.email, admin.name, hospital.name, plan, amountPaid, (hospital as any).planRenewsAt
            );
          }
        } catch (error) {
          console.error('Failed to send subscription receipt email:', error);
        }
      }
    }

    return { status: 'ok' };
  }
}