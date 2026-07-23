import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TherapiesController } from './therapies.controller';
import { TherapiesService } from './therapies.service';
import { Therapy, TherapySchema } from './schemas/therapy.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Therapy.name, schema: TherapySchema }])],
  controllers: [TherapiesController],
  providers: [TherapiesService],
  exports: [TherapiesService],
})
export class TherapiesModule {}