// import { PartialType } from '@nestjs/mapped-types';
// import { CreateHospitalDto } from './create-hospital.dto';

// export class UpdateHospitalDto extends PartialType(CreateHospitalDto) {}


import { PartialType } from '@nestjs/mapped-types';
import { CreateHospitalDto } from './create-hospital.dto';
import { IsOptional, IsObject, IsString } from 'class-validator';

export class UpdateHospitalDto extends PartialType(CreateHospitalDto) {
  // 🚀 Add this to allow the Super Admin to save WhatsApp keys
  @IsOptional()
  @IsObject()
  whatsappConfig?: {
    accessToken?: string;
    phoneId?: string;
    businessAccountId?: string;
    verifyToken?: string;
  };

  // Ensure other fields from your schema are also allowed if not in CreateHospitalDto
  @IsOptional()
  @IsString()
  plan?: string;

  @IsOptional()
  @IsString()
  status?: string;
}