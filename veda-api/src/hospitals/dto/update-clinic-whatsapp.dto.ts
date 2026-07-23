import { IsString, IsOptional } from 'class-validator';

export class UpdateClinicWhatsAppDto {
  @IsOptional()
  @IsString()
  accessToken?: string;

  @IsOptional()
  @IsString()
  phoneId?: string;
}