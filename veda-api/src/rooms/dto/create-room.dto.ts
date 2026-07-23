import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsNumber()
  capacity?: number;

  @IsOptional()
  @IsString()
  status?: string;

  // 🚀 Let the backend know we will attach a hospital ID
  @IsOptional()
  @IsString()
  hospitalId?: string; 
}
