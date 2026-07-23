import { Controller, Get, Query, UseGuards, Request, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';
import { TallyService } from './tally.service';

@Controller('tally')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class TallyController {
  constructor(private readonly tallyService: TallyService) {}

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Get('export/stock-items')
  async exportStockItems(@Request() req, @Res() res: Response) {
    const xml = await this.tallyService.exportStockItems(req.user.hospitalId);
    res.set({
      'Content-Type': 'application/xml',
      'Content-Disposition': `attachment; filename="tally_stock_items_${new Date().toISOString().split('T')[0]}.xml"`,
    });
    res.send(xml);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Get('export/sales-vouchers')
  async exportSalesVouchers(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Request() req,
    @Res() res: Response,
  ) {
    const xml = await this.tallyService.exportSalesVouchers(req.user.hospitalId, startDate, endDate);
    res.set({
      'Content-Type': 'application/xml',
      'Content-Disposition': `attachment; filename="tally_sales_vouchers_${startDate}_to_${endDate}.xml"`,
    });
    res.send(xml);
  }

  // ✅ Live sync — requires a reachable Tally server URL configured under
  // Clinic Settings. These actually connect over HTTP, unlike the download
  // endpoints above which just produce a file for manual import.
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Get('test-connection')
  testConnection(@Request() req) {
    return this.tallyService.testConnection(req.user.hospitalId);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Get('sync/pull-stock')
  pullStock(@Request() req) {
    return this.tallyService.pullStockItemsFromTally(req.user.hospitalId);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Get('sync/push-vouchers')
  pushVouchers(@Query('startDate') startDate: string, @Query('endDate') endDate: string, @Request() req) {
    return this.tallyService.pushSalesVouchersLive(req.user.hospitalId, startDate, endDate);
  }
}
