// import { PartialType } from '@nestjs/mapped-types';
// import { CreateAppointmentDto } from './create-appointment.dto';
// import { IsOptional, IsString, IsArray, ValidateNested, IsBoolean, IsObject } from 'class-validator';
// import { Type } from 'class-transformer';

// class RecommendedTherapyDto {
//   @IsString()
//   treatmentName: string;
//   @IsOptional() @IsString()
//   notes?: string;
//   @IsOptional() @IsBoolean()
//   isProcessed?: boolean;
// }

// export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {
//   // 🚀 ADD THESE TO FIX THE "SHOULD NOT EXIST" ERRORS
//   @IsOptional() @IsString() status?: string;
//   @IsOptional() @IsObject() vitals?: any;
//   @IsOptional() @IsArray() medicines?: any[];

//   // Clinical Fields
//   @IsOptional() @IsString() chiefComplaints?: string;
//   @IsOptional() @IsString() diagnosis?: string;
//   @IsOptional() @IsString() nextFollowUpDate?: string;

//   // Recommendations Array
//   @IsOptional()
//   @IsArray()
//   @ValidateNested({ each: true })
//   @Type(() => RecommendedTherapyDto)
//   recommendedTherapies?: RecommendedTherapyDto[];
// }

// import { PartialType } from '@nestjs/mapped-types';
// import { CreateAppointmentDto } from './create-appointment.dto';
// import { IsOptional, IsString, IsArray, ValidateNested, IsBoolean, IsObject } from 'class-validator';
// import { Type } from 'class-transformer';

// class RecommendedTherapyDto {
//   @IsString()
//   treatmentName: string;
//   @IsOptional() @IsString()
//   notes?: string;
//   @IsOptional() @IsBoolean()
//   isProcessed?: boolean;
// }

// export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {
//   @IsOptional() @IsString() status?: string;
//   @IsOptional() @IsObject() vitals?: any;
  
//   // 🚀 THE FIX: Add this to whitelist the medicines data
//   @IsOptional() 
//   @IsArray() 
//   medicinesUsed?: any[]; 

//   @IsOptional() @IsString() chiefComplaints?: string;
//   @IsOptional() @IsString() diagnosis?: string;
//   @IsOptional() @IsString() nextFollowUpDate?: string;

//   @IsOptional()
//   @IsArray()
//   @ValidateNested({ each: true })
//   @Type(() => RecommendedTherapyDto)
//   recommendedTherapies?: RecommendedTherapyDto[];
// }



import { PartialType } from '@nestjs/mapped-types';
import { CreateAppointmentDto } from './create-appointment.dto';
import { IsOptional, IsString, IsArray, ValidateNested, IsBoolean, IsObject, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

// Child class for structured medicine data
class MedicineUsedDto {
  @IsString()
  inventoryId: string;

  @IsNumber()
  @Type(() => Number)
  quantity: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  priceAtTime?: number;
}

class RecommendedTherapyDto {
  @IsString()
  treatmentName: string;
  @IsOptional() @IsString()
  notes?: string;
  @IsOptional() @IsBoolean()
  isProcessed?: boolean;
}

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsObject() vitals?: any;
  
  // 🚀 THE FIX: Add this to whitelist the medicines data
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MedicineUsedDto)
  medicinesUsed?: MedicineUsedDto[]; 

  @IsOptional() @IsString() chiefComplaints?: string;
  @IsOptional() @IsString() diagnosis?: string;
  @IsOptional() @IsString() nextFollowUpDate?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecommendedTherapyDto)
  recommendedTherapies?: RecommendedTherapyDto[];
}