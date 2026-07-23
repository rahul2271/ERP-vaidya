import { IsString, IsNumber, IsOptional, IsNotEmpty, IsArray } from 'class-validator';

export class CreatePatientDto {
  // 🚀 FIX: This stops the "property uhid should not exist" error!
  @IsOptional()
  @IsString()
  uhid?: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  age: number;

  @IsNotEmpty()
  @IsString()
  gender: string;

  @IsNotEmpty()
  @IsString()
  mobile: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  assignedDoctorId?: string;

  @IsOptional()
  @IsString()
  hospitalId?: string;

  // 🚀 CLINICAL FIELDS: Ensures the doctor's initial notes don't get stripped out
  @IsOptional()
  @IsString()
  prakriti?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  medicalHistory?: string[];

  @IsOptional()
  @IsString()
  chiefComplaints?: string;

  @IsOptional()
  @IsString()
  diagnosis?: string;
}