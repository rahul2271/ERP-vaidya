import { Model } from 'mongoose';
import { SettingDocument } from './schemas/setting.schema';
import { UpdateSettingDto } from './dto/update-setting.dto';
export declare class SettingsService {
    private settingModel;
    private readonly logger;
    constructor(settingModel: Model<SettingDocument>);
    getGlobalSettings(): Promise<SettingDocument>;
    updateGlobalSettings(updateSettingDto: UpdateSettingDto): Promise<SettingDocument>;
}
