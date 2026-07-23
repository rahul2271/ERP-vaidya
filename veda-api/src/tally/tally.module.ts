import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Inventory, InventorySchema } from '../inventory/schemas/inventory.schema';
import { Appointment, AppointmentSchema } from '../appointments/schemas/appointment.schema';
import { HospitalsModule } from '../hospitals/hospitals.module';
import { TallyService } from './tally.service';
import { TallyController } from './tally.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Inventory.name, schema: InventorySchema },
      { name: Appointment.name, schema: AppointmentSchema },
    ]),
    HospitalsModule,
  ],
  controllers: [TallyController],
  providers: [TallyService],
})
export class TallyModule {}
