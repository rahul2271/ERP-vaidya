import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { Inventory, InventorySchema } from './schemas/inventory.schema';
// ✅ ADD THESE TWO IMPORTS:
import { InventoryHistory, InventoryHistorySchema } from './schemas/inventory-history.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Inventory.name, schema: InventorySchema },
      // ✅ Registering the history schema for database automation
      { name: InventoryHistory.name, schema: InventoryHistorySchema } 
    ])
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService] // Export so Appointments can use it
})
export class InventoryModule {}