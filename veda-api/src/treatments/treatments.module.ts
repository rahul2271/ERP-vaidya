import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TreatmentsController } from './treatments.controller';
import { TreatmentsService } from './treatments.service'; 
import { Treatment, TreatmentSchema } from './schemas/treatment.schema';
// 🚀 1. Import UsersModule
import { UsersModule } from '../users/users.module'; 

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Treatment.name, schema: TreatmentSchema }]),
    // 🚀 2. Add UsersModule to the imports array
    UsersModule, 
  ],
  controllers: [TreatmentsController],
  providers: [TreatmentsService], 
  exports: [TreatmentsService], 
})
export class TreatmentsModule {}