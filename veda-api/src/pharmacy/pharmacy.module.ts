import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PharmacyController } from './pharmacy.controller';
import { PharmacyService } from './pharmacy.service';
import { PharmacySale, PharmacySaleSchema } from './schemas/pharmacy-sale.schema';
import { Inventory, InventorySchema } from '../inventory/schemas/inventory.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PharmacySale.name, schema: PharmacySaleSchema },
      // We import Inventory so the PharmacyService can deduct stock
      { name: Inventory.name, schema: InventorySchema } 
    ])
  ],
  controllers: [PharmacyController],
  providers: [PharmacyService],
})
export class PharmacyModule {}