import { IsString, IsNotEmpty, IsOptional, IsIn, IsEmail } from 'class-validator';

export class CreateHospitalDto {
  @IsString()
  @IsNotEmpty({ message: 'Hospital name is required' })
  name: string;

  // 🚀 Added domain slug
  @IsString()
  @IsNotEmpty({ message: 'Hospital domain slug is required' })
  domain: string; 

  // 🚀 FIXED: Added email so the ValidationPipe allows it through to Mongoose
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Contact email is required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'City is required' })
  city: string;

  @IsString()
  @IsNotEmpty({ message: 'State is required' })
  state: string;

  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  phone: string; 

  @IsString()
  @IsOptional()
  @IsIn(['Active', 'Inactive'], { message: 'Status must be Active or Inactive' })
  status?: string;
}
