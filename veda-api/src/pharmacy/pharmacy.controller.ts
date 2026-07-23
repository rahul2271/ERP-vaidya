import { Controller, Get, Post, Body, UseGuards, Request, Query } from '@nestjs/common';
import { PharmacyService } from './pharmacy.service';
import { AuthGuard } from '@nestjs/passport'; 
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';
import { RolesGuard } from '../auth/roles.guard';

@Controller('pharmacy')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class PharmacyController {
  constructor(private readonly pharmacyService: PharmacyService) {}

  // 🛒 Process a New Sale
  @Post('sale')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.PHARMACIST, Role.RECEPTIONIST)
  createSale(@Body() saleData: any, @Request() req: any) {
    return this.pharmacyService.createSale(saleData, req.user);
  }

  // 📊 Get Daily Cash Register Totals
  @Get('settlement')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.PHARMACIST, Role.RECEPTIONIST)
  getDailySettlement(@Request() req: any, @Query('date') date: string) {
    const targetDate = date || new Date().toISOString();
    return this.pharmacyService.getDailySettlement(req.user.hospitalId, targetDate);
  }

  // 📜 View All Past Invoices
  @Get('sales')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.PHARMACIST, Role.RECEPTIONIST)
  getAllSales(@Request() req: any) {
    return this.pharmacyService.getAllSales(req.user.hospitalId);
  }
}