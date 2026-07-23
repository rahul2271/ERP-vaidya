import { SettingsService } from './settings.service';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { MailService } from '../mail/mail.service';
export declare class SettingsController {
    private readonly settingsService;
    private readonly mailService;
    constructor(settingsService: SettingsService, mailService: MailService);
    getGlobalSettings(): Promise<import("./schemas/setting.schema").SettingDocument>;
    updateGlobalSettings(updateSettingDto: UpdateSettingDto): Promise<import("./schemas/setting.schema").SettingDocument>;
    testEmailConnection(): Promise<{
        success: boolean;
        message: string;
    }>;
}
