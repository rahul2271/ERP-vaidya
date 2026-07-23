// import { IsString, IsEmail, IsEnum, IsOptional, IsBoolean, IsMongoId } from 'class-validator';

// export class CreateUserDto {
//   @IsString()
//   name: string;

//   @IsEmail()
//   email: string;

//   // ✅ ADD THIS: Allow password to be optional (or required)
//   @IsOptional() 
//   @IsString()
//   password?: string;

//   @IsOptional()
//   @IsString()
//   role?: string;

//   @IsOptional()
//   @IsString()
//   specialization?: string;

//   @IsOptional()
//   @IsMongoId()
//   hospitalId?: string;
// }


// import { IsString, IsEmail, IsOptional, IsMongoId, IsNumber } from 'class-validator';

// export class CreateUserDto {
//   @IsString()
//   name: string;

//   @IsEmail()
//   email: string;

//   // 🚀 Added Mobile (Required by your frontend form)
//   @IsString()
//   mobile: string; 

//   // 🚀 Added Age (Passed as default 30 in frontend)
//   @IsNumber()
//   @IsOptional()
//   age?: number;

//   // 🚀 Added Gender (Passed as default "O" in frontend)
//   @IsString()
//   @IsOptional()
//   gender?: string;

//   @IsOptional() 
//   @IsString()
//   password?: string;

//   @IsOptional()
//   @IsString()
//   role?: string;

//   @IsOptional()
//   @IsString()
//   specialization?: string;

//   @IsOptional()
//   @IsMongoId()
//   hospitalId?: string;

//   @IsOptional()
//   @IsString()
//   attendanceStatus?: string;
// }


import { 
  IsString, 
  IsEmail, 
  IsOptional, 
  IsMongoId, 
  IsNumber, 
  IsObject, 
  IsBoolean, 
  ValidateNested 
} from 'class-validator';
import { Type } from 'class-transformer';

// 🚀 Define the structure for the permissions object
class UserPermissionsDto {
  @IsBoolean()
  @IsOptional()
  canViewFinancials: boolean;

  @IsBoolean()
  @IsOptional()
  canEditInventory: boolean;

  @IsBoolean()
  @IsOptional()
  canExportData: boolean;
}

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  mobile: string; 

  @IsNumber()
  @IsOptional()
  age?: number;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsOptional() 
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  specialization?: string;

  @IsOptional()
  @IsMongoId()
  hospitalId?: string;

  // 🚀 THE FIX: Tell NestJS that the 'permissions' object is allowed
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => UserPermissionsDto)
  permissions?: UserPermissionsDto;
}