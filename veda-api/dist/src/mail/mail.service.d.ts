import { SettingsService } from '../settings/settings.service';
export declare class MailService {
    private readonly settingsService;
    private readonly logger;
    constructor(settingsService: SettingsService);
    sendWelcomeEmail(toEmail: string, name: string, role?: string, tempPass?: string): Promise<void>;
    sendTrialWelcomeEmail(toEmail: string, adminName: string, hospitalName: string, trialEndsAt: Date): Promise<void>;
    sendTrialEndingSoonEmail(toEmail: string, adminName: string, hospitalName: string, daysLeft: number): Promise<void>;
    sendSubscriptionReceiptEmail(toEmail: string, adminName: string, hospitalName: string, plan: string, amount: number, renewsAt: Date): Promise<void>;
}
