"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = __importStar(require("nodemailer"));
const settings_service_1 = require("../settings/settings.service");
let MailService = MailService_1 = class MailService {
    settingsService;
    logger = new common_1.Logger(MailService_1.name);
    constructor(settingsService) {
        this.settingsService = settingsService;
    }
    async sendWelcomeEmail(toEmail, name, role = 'User', tempPass = 'N/A') {
        try {
            const settings = await this.settingsService.getGlobalSettings();
            if (!settings.smtpHost || !settings.smtpUser) {
                this.logger.warn('SMTP settings are missing. Email not sent.');
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
        }
        catch (error) {
            this.logger.error('❌ Failed to send email', error);
            throw error;
        }
    }
    async sendTrialWelcomeEmail(toEmail, adminName, hospitalName, trialEndsAt) {
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
        }
        catch (error) {
            this.logger.error('❌ Failed to send trial welcome email', error);
            throw error;
        }
    }
    async sendTrialEndingSoonEmail(toEmail, adminName, hospitalName, daysLeft) {
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
        }
        catch (error) {
            this.logger.error('❌ Failed to send trial reminder email', error);
        }
    }
    async sendSubscriptionReceiptEmail(toEmail, adminName, hospitalName, plan, amount, renewsAt) {
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
        }
        catch (error) {
            this.logger.error('❌ Failed to send subscription receipt email', error);
        }
    }
};
exports.MailService = MailService;
exports.MailService = MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [settings_service_1.SettingsService])
], MailService);
//# sourceMappingURL=mail.service.js.map