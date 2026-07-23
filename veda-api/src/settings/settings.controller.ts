// // import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
// // import { SettingsService } from './settings.service';
// // import { UpdateSettingDto } from './dto/update-setting.dto';
// // import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// // import { RolesGuard } from '../auth/roles.guard';
// // import { Roles } from '../auth/roles.decorator';
// // import { Role } from '../auth/roles.enum';

// // @Controller('settings')
// // export class SettingsController {
// //   constructor(private readonly settingsService: SettingsService) {}

// //   @UseGuards(JwtAuthGuard, RolesGuard)
// //   @Roles(Role.SUPER_ADMIN) // 🚀 Only Super Admin can access!
// //   @Get('global')
// //   async getGlobalSettings() {
// //     return this.settingsService.getGlobalSettings();
// //   }

// //   @UseGuards(JwtAuthGuard, RolesGuard)
// //   @Roles(Role.SUPER_ADMIN) // 🚀 Only Super Admin can modify!
// //   @Patch('global')
// //   async updateGlobalSettings(@Body() updateSettingDto: UpdateSettingDto) {
// //     return this.settingsService.updateGlobalSettings(updateSettingDto);
// //   }
// // }

// import { Controller, Get, Patch, Post, Body, UseGuards } from '@nestjs/common';
// import { SettingsService } from './settings.service';
// import { UpdateSettingDto } from './dto/update-setting.dto';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { RolesGuard } from '../auth/roles.guard';
// import { Roles } from '../auth/roles.decorator';
// import { Role } from '../auth/roles.enum';
// import { MailService } from '../mail/mail.service'; // 🚀 Import MailService

// @Controller('settings')
// export class SettingsController {
//   constructor(
//     private readonly settingsService: SettingsService,
//     private readonly mailService: MailService // 🚀 Inject MailService
//   ) {}

//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles(Role.SUPER_ADMIN)
//   @Get('global')
//   async getGlobalSettings() {
//     return this.settingsService.getGlobalSettings();
//   }

//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles(Role.SUPER_ADMIN)
//   @Patch('global')
//   async updateGlobalSettings(@Body() updateSettingDto: UpdateSettingDto) {
//     return this.settingsService.updateGlobalSettings(updateSettingDto);
//   }

//   // 🚀 NEW: Route to test the SMTP Connection
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles(Role.SUPER_ADMIN)
//   @Post('test-email')
//   async testEmailConnection() {
//     const settings = await this.settingsService.getGlobalSettings();
    
//     // Dispatches a test email using the credentials saved in DB
//     await this.mailService.sendWelcomeEmail(
//       settings.supportEmail, 
//       'Super Admin', 
//       'TEST_ROLE', 
//       'TEMP_PASSWORD_123'
//     );
    
//     return { 
//       success: true, 
//       message: `Test email dispatched to ${settings.supportEmail}. Please check your Mailtrap inbox.` 
//     };
//   }
// }

import { Controller, Get, Patch, Post, Body, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';
import { MailService } from '../mail/mail.service';

@Controller('settings')
export class SettingsController {
  constructor(
    private readonly settingsService: SettingsService,
    private readonly mailService: MailService 
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  // 🚀 CHANGE: Allow all roles to GET settings so the UI can load platform name/timezone
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.TELECALLER, Role.DOCTOR, Role.RECEPTIONIST) 
  @Get('global')
  async getGlobalSettings() {
    return this.settingsService.getGlobalSettings();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN) // 🛡️ Keep only Super Admin for saving
  @Patch('global')
  async updateGlobalSettings(@Body() updateSettingDto: UpdateSettingDto) {
    return this.settingsService.updateGlobalSettings(updateSettingDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN) // 🛡️ Keep only Super Admin for email testing
  @Post('test-email')
  async testEmailConnection() {
    try {
      const settings = await this.settingsService.getGlobalSettings();
      await this.mailService.sendWelcomeEmail(
        settings.supportEmail, 
        'Super Admin', 
        'TEST_PING', 
        'N/A'
      );
      return { 
        success: true, 
        message: `Test email dispatched to ${settings.supportEmail}.` 
      };
    } catch (error) {
      return { 
        success: false, 
        message: 'SMTP Handshake failed. Check your settings.' 
      };
    }
  }
}