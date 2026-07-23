import { PartialType } from '@nestjs/mapped-types'; // Or '@nestjs/swagger' if using Swagger
import { CreatePatientDto } from './create-patient.dto';

export class UpdatePatientDto extends PartialType(CreatePatientDto) {}