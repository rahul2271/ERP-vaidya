// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { Setting, SettingDocument } from './schemas/setting.schema';
// import { UpdateSettingDto } from './dto/update-setting.dto';

// @Injectable()
// export class SettingsService {
//   constructor(@InjectModel(Setting.name) private settingModel: Model<SettingDocument>) {}

//   async getGlobalSettings(): Promise<Setting> {
//     let settings = await this.settingModel.findOne().exec();
    
//     if (!settings) {
//       settings = await this.settingModel.create({});
//     }
//     return settings;
//   }

//   async updateGlobalSettings(updateSettingDto: UpdateSettingDto): Promise<Setting> {
//     let settings = await this.settingModel.findOne().exec();
    
//     if (!settings) {
//       return this.settingModel.create(updateSettingDto);
//     }

//     const updatedSettings = await this.settingModel.findByIdAndUpdate(
//       settings._id, 
//       { $set: updateSettingDto }, 
//       { new: true }
//     ).exec();

//     // 🚀 FIX: We add 'as Setting' to assure strict TypeScript that this will not be null
//     return updatedSettings as Setting; 
//   }
// }
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Setting, SettingDocument } from './schemas/setting.schema';
import { UpdateSettingDto } from './dto/update-setting.dto';

@Injectable()
export class SettingsService {
  private readonly logger = new Logger(SettingsService.name);

  constructor(@InjectModel(Setting.name) private settingModel: Model<SettingDocument>) {}

  // 🚀 FETCH GLOBAL CONFIG
  async getGlobalSettings(): Promise<SettingDocument> {
    let settings = await this.settingModel.findOne().exec();
    
    // 🚀 CRITICAL: If no settings exist (first run), create the default doc
    // This fixes the "Failed to load" error on the frontend
    if (!settings) {
      this.logger.log('No global settings found. Creating system defaults...');
      settings = await this.settingModel.create({
        platformName: 'VAIDYA ERP',
        supportEmail: 'support@vaidyaerp.com',
        // Default WhatsApp keys are empty strings until set via UI
        defaultWhatsAppToken: '',
        defaultWhatsAppPhoneId: '',
      });
    }
    return settings;
  }

  // 🚀 UPDATE GLOBAL CONFIG
  async updateGlobalSettings(updateSettingDto: UpdateSettingDto): Promise<SettingDocument> {
    // We use findOneAndUpdate with 'upsert: true' to ensure we only ever have ONE settings doc
    const updatedSettings = await this.settingModel.findOneAndUpdate(
      {}, // Empty filter targets the first/only document
      { $set: updateSettingDto },
      { 
        new: true, 
        upsert: true, // Creates the doc if it doesn't exist
        runValidators: true 
      }
    ).exec();

    this.logger.log('Global settings updated successfully via Admin UI');
    return updatedSettings;
  }
}