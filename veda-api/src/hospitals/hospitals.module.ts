import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HospitalsService } from './hospitals.service';
import { HospitalsController } from './hospitals.controller';
import { Hospital, HospitalSchema } from './schemas/hospital.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Hospital.name, schema: HospitalSchema }])
  ],
  controllers: [HospitalsController],
  providers: [HospitalsService],
  // 🚀 CRITICAL FIX: Export MongooseModule so HospitalModel is visible elsewhere
  exports: [HospitalsService, MongooseModule], 
})
export class HospitalsModule {}