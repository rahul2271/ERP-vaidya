import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly settingsService: SettingsService) {}

  // 🚀 UPDATED: Added role and tempPass parameters with default values
  async sendWelcomeEmail(toEmail: string, name: string, role: string = 'User', tempPass: string = 'N/A') {
    try {
      // 1. Fetch live credentials from the database
      const settings = await this.settingsService.getGlobalSettings();

      if (!settings.smtpHost || !settings.smtpUser) {
        this.logger.warn('SMTP settings are missing. Email not sent.');
        return;
      }

      // 2. Create transporter using database values
      const transporter = nodemailer.createTransport({
        host: settings.smtpHost,
        port: Number(settings.smtpPort),
        auth: {
          user: settings.smtpUser,
          pass: settings.smtpPass,
        },
      });

      // 3. Send the email with a richer HTML template
      await transporter.sendMail({
        from: `"${settings.platformName}" <${settings.supportEmail}>`,
        to: toEmail,
        subject: `Welcome to ${settings.platformName}!`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h1 style="color: #2563eb;">Welcome to ${settings.platformName}, ${name}!</h1>
            <p>Your account has been successfully created.</p>
            <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Role:</strong> ${role.replace('_', ' ')}</p>
              <p style="margin: 5px 0;"><strong>Temporary Password:</strong> ${tempPass}</p>
            </div>
            <p style="font-size: 0.8em; color: #666;">Please change your password after your first login.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 0.7em; color: #999;">Support: ${settings.supportEmail} | ${settings.supportPhone}</p>
          </div>
        `,
      });

      this.logger.log(`✅ Email successfully sent to ${toEmail}`);
    } catch (error) {
      this.logger.error('❌ Failed to send email', error);
      // Re-throw the error so the Controller's try/catch can catch it for the UI
      throw error; 
    }
  }

  // 🚀 Sent once, right after self-serve signup. Uses the platform's own SMTP
  // (global settings) since the new hospital hasn't configured their own yet.
  async sendTrialWelcomeEmail(toEmail: string, adminName: string, hospitalName: string, trialEndsAt: Date) {
    try {
      const settings = await this.settingsService.getGlobalSettings();

      if (!settings.smtpHost || !settings.smtpUser) {
        this.logger.warn('SMTP settings are missing. Welcome email not sent.');
        return;
      }

      const transporter = nodemailer.createTransport({
        host: settings.smtpHost,
        port: Number(settings.smtpPort),
        auth: {
          user: settings.smtpUser,
          pass: settings.smtpPass,
        },
      });

      const formattedDate = trialEndsAt.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

      await transporter.sendMail({
        from: `"${settings.platformName}" <${settings.supportEmail}>`,
        to: toEmail,
        subject: `Welcome to ${settings.platformName} — your 15-day Premium trial has started`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #232a26;">
            <h1 style="color: #25786f;">Welcome, ${adminName}!</h1>
            <p><strong>${hospitalName}</strong> is now live on ${settings.platformName}, with full access to every Premium feature for the next 15 days — no card required.</p>
            <div style="background: #f6f8f7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Trial ends:</strong> ${formattedDate}</p>
              <p style="margin: 5px 0;">After that, you'll need to choose a Basic or Premium plan to keep going — we'll remind you before it happens.</p>
            </div>
            <p>In the meantime, set up your team, patients, and clinic settings — everything you do during the trial carries over.</p>
            <hr style="border: none; border-top: 1px solid #eaeeec; margin: 20px 0;" />
            <p style="font-size: 0.8em; color: #82938a;">Support: ${settings.supportEmail} | ${settings.supportPhone}</p>
          </div>
        `,
      });

      this.logger.log(`✅ Trial welcome email sent to ${toEmail}`);
    } catch (error) {
      this.logger.error('❌ Failed to send trial welcome email', error);
      throw error;
    }
  }

  // 🚀 Sent by a scheduled check (or on-demand) a few days before trial expiry.
  async sendTrialEndingSoonEmail(toEmail: string, adminName: string, hospitalName: string, daysLeft: number) {
    try {
      const settings = await this.settingsService.getGlobalSettings();
      if (!settings.smtpHost || !settings.smtpUser) {
        this.logger.warn('SMTP settings are missing. Trial reminder not sent.');
        return;
      }

      const transporter = nodemailer.createTransport({
        host: settings.smtpHost,
        port: Number(settings.smtpPort),
        auth: { user: settings.smtpUser, pass: settings.smtpPass },
      });

      await transporter.sendMail({
        from: `"${settings.platformName}" <${settings.supportEmail}>`,
        to: toEmail,
        subject: `${daysLeft} day${daysLeft === 1 ? '' : 's'} left in your ${settings.platformName} trial`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #232a26;">
            <h1 style="color: #c98a3a;">Your trial ends in ${daysLeft} day${daysLeft === 1 ? '' : 's'}</h1>
            <p>Hi ${adminName}, <strong>${hospitalName}</strong>'s Premium trial is wrapping up soon. Upgrade now so your team doesn't lose access.</p>
            <p style="font-size: 0.8em; color: #82938a;">Support: ${settings.supportEmail} | ${settings.supportPhone}</p>
          </div>
        `,
      });

      this.logger.log(`✅ Trial reminder sent to ${toEmail}`);
    } catch (error) {
      this.logger.error('❌ Failed to send trial reminder email', error);
    }
  }

  // 🚀 Sent automatically after a verified successful payment (see payments webhook).
  // Uses the platform's own SMTP since this is a platform-to-customer billing email,
  // not a patient-facing one (those use each hospital's own SMTP instead).
  async sendSubscriptionReceiptEmail(toEmail: string, adminName: string, hospitalName: string, plan: string, amount: number, renewsAt: Date) {
    try {
      const settings = await this.settingsService.getGlobalSettings();
      if (!settings.smtpHost || !settings.smtpUser) {
        this.logger.warn('SMTP settings are missing. Subscription receipt not sent.');
        return;
      }

      const transporter = nodemailer.createTransport({
        host: settings.smtpHost,
        port: Number(settings.smtpPort),
        auth: { user: settings.smtpUser, pass: settings.smtpPass },
      });

      const paidOn = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
      const renewsOn = renewsAt.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
      const receiptNo = `INV-${Date.now().toString().slice(-8)}`;

      await transporter.sendMail({
        from: `"${settings.platformName}" <${settings.supportEmail}>`,
        to: toEmail,
        subject: `Payment receipt — ${plan} plan (${receiptNo})`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #232a26;">
            <h1 style="color: #25786f;">Payment received — thank you!</h1>
            <p>Hi ${adminName}, this confirms your payment for <strong>${hospitalName}</strong>.</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background: #f6f8f7; border-radius: 8px; overflow: hidden;">
              <tr><td style="padding: 10px 15px; color: #65766c;">Receipt No.</td><td style="padding: 10px 15px; text-align: right; font-weight: bold;">${receiptNo}</td></tr>
              <tr><td style="padding: 10px 15px; color: #65766c;">Plan</td><td style="padding: 10px 15px; text-align: right; font-weight: bold;">${plan}</td></tr>
              <tr><td style="padding: 10px 15px; color: #65766c;">Amount paid</td><td style="padding: 10px 15px; text-align: right; font-weight: bold;">₹${amount.toLocaleString('en-IN')}</td></tr>
              <tr><td style="padding: 10px 15px; color: #65766c;">Paid on</td><td style="padding: 10px 15px; text-align: right; font-weight: bold;">${paidOn}</td></tr>
              <tr><td style="padding: 10px 15px; color: #65766c;">Next billing date</td><td style="padding: 10px 15px; text-align: right; font-weight: bold;">${renewsOn}</td></tr>
            </table>
            <p style="font-size: 0.85em; color: #82938a;">Keep this email as your receipt for accounting purposes.</p>
            <hr style="border: none; border-top: 1px solid #eaeeec; margin: 20px 0;" />
            <p style="font-size: 0.8em; color: #82938a;">Support: ${settings.supportEmail} | ${settings.supportPhone}</p>
          </div>
        `,
      });

      this.logger.log(`✅ Subscription receipt sent to ${toEmail}`);
    } catch (error) {
      this.logger.error('❌ Failed to send subscription receipt email', error);
    }
  }
}
