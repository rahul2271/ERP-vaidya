// import { PartialType } from '@nestjs/mapped-types';
// import { CreateUserDto } from './create-user.dto';

// export class UpdateUserDto extends PartialType(CreateUserDto) {}


import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString, IsIn } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  // 🚀 FIX: Tell the backend this field is allowed in PATCH requests
  @IsOptional()
  @IsString()
  @IsIn(['AVAILABLE', 'BUSY', 'OFFLINE'])
  attendanceStatus?: string;
}