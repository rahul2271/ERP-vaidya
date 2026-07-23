// import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

// export class UpdateSettingDto {
//   @IsOptional() @IsString() platformName?: string;
//   @IsOptional() @IsString() supportEmail?: string;
//   @IsOptional() @IsString() supportPhone?: string;
//   @IsOptional() @IsString() timeZone?: string;
  
//   @IsOptional() @IsString() smsApiKey?: string;
//   @IsOptional() @IsString() smtpHost?: string;
//   @IsOptional() @IsString() smtpPort?: string;
//   @IsOptional() @IsString() smtpUser?: string;
//   @IsOptional() @IsString() smtpPass?: string;
//   @IsOptional() @IsString() razorpayKey?: string;

//   @IsOptional() @IsBoolean() maintenanceMode?: boolean;
//   @IsOptional() @IsNumber() maxLoginAttempts?: number;
//   @IsOptional() @IsNumber() sessionTimeoutMins?: number;
// }


import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class UpdateSettingDto {
  @IsOptional() @IsString() platformName?: string;
  @IsOptional() @IsString() supportEmail?: string;
  @IsOptional() @IsString() supportPhone?: string;
  @IsOptional() @IsString() timeZone?: string;
  
  @IsOptional() @IsString() smsApiKey?: string;
  @IsOptional() @IsString() smtpHost?: string;
  @IsOptional() @IsString() smtpPort?: string;
  @IsOptional() @IsString() smtpUser?: string;
  @IsOptional() @IsString() smtpPass?: string;
  @IsOptional() @IsString() razorpayKey?: string;

  // 🚀 FIX: ADDED WHATSAPP FIELDS TO DTO
  @IsOptional() @IsString() defaultWhatsAppToken?: string;
  @IsOptional() @IsString() defaultWhatsAppPhoneId?: string;
  @IsOptional() @IsString() defaultWhatsAppVerifyToken?: string;

  @IsOptional() @IsBoolean() maintenanceMode?: boolean;
  @IsOptional() @IsNumber() maxLoginAttempts?: number;
  @IsOptional() @IsNumber() sessionTimeoutMins?: number;
}
