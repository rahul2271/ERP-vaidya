// import { 
//   Controller, Get, Post, Patch, Body, UseGuards, Request 
// } from '@nestjs/common';
// import { InventoryService } from './inventory.service';
// import { AuthGuard } from '@nestjs/passport';

// @Controller('inventory')
// @UseGuards(AuthGuard('jwt'))
// export class InventoryController {
//   constructor(private readonly inventoryService: InventoryService) {}

//   @Post()
//   create(@Body() createDto: any, @Request() req) {
//     return this.inventoryService.create(createDto, req.user);
//   }

//   @Get()
//   findAll(@Request() req) {
//     return this.inventoryService.findAll(req.user.hospitalId);
//   }

//   @Patch('deduct')
//   async deduct(@Body() deductDto: any, @Request() req) {
//     // ✅ PASSING ALL 5 ARGUMENTS: Fixes the TS2554 Error
//     return this.inventoryService.deductStock(
//       deductDto.inventoryId, 
//       deductDto.quantity, 
//       req.user.hospitalId, // From JWT
//       req.user.userId,     // From JWT
//       deductDto.notes || 'Treatment Session Deduction' // Default note
//     );
//   }

//   @Get('low-stock-alerts')
// async getLowStock(@Request() req) {
//   // Filters for items belonging to Yukti Herbs with stock less than 10
//   return this.inventoryModel.find({ 
//     hospitalId: req.user.hospitalId, 
//     stock: { $lt: 10 } 
//   }).exec();
// }
// }

import { 
  Controller, Get, Post, Patch, Body, Request 
} from '@nestjs/common';
import { Delete, Param, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('inventory')
@UseGuards(AuthGuard('jwt'))
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  create(@Body() createDto: any, @Request() req) {
    return this.inventoryService.create(createDto, req.user);
  }

  @Get()
  findAll(@Request() req) {
    return this.inventoryService.findAll(req.user.hospitalId);
  }

  // ✅ New Endpoint for Dashboard Widget
  @Get('low-stock-alerts')
  async getLowStock(@Request() req) {
    // Calls the service method we added in the previous step
    return this.inventoryService.getLowStockAlerts(req.user.hospitalId);
  }

  // ✅ New Endpoint for Dashboard Activity Feed
  @Get('history')
  async getHistory(@Request() req) {
    return this.inventoryService.getHistory(req.user.hospitalId);
  }

  @Patch('deduct')
  async deduct(@Body() deductDto: any, @Request() req) {
    // Fixes the previous argument error by passing all 5 required fields
    return this.inventoryService.deductStock(
      deductDto.inventoryId, 
      deductDto.quantity, 
      req.user.hospitalId,
      req.user.userId,
      deductDto.notes || 'Treatment Session Deduction'
    );
  }

  // ✅ ADD THIS MISSING ROUTE TO FIX THE 404 ERROR
  @Delete(':id')
  @UseGuards(AuthGuard('jwt')) 
  remove(@Param('id') id: string) {
    return this.inventoryService.remove(id);
  }
}