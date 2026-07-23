// import { Controller, Get, Patch, Param, UseGuards, Request } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
// import { ReportsService } from './reports.service';

// @Controller('reports')
// @UseGuards(AuthGuard('jwt')) // Protects all report routes
// export class ReportsController {
//   constructor(private readonly reportsService: ReportsService) {}

//   // 🚀 GET: /reports/pending
//   @Get('pending')
//   async getPending(@Request() req: any) {
//     // req.user.hospitalId comes from your JWT strategy
//     return this.reportsService.getPendingForDoctor(req.user.hospitalId);
//   }

//   // 🚀 PATCH: /reports/:id/review
//   @Patch(':id/review')
//   async review(@Param('id') id: string) {
//     return this.reportsService.markAsReviewed(id);
//   }
// }

import { Controller, Get, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ReportsService } from './reports.service';

// 🚀 FIX: Import Role Guards and Decorators
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';
import { RolesGuard } from '../auth/roles.guard';

@Controller('reports')
// 🚀 FIX: Apply the RolesGuard alongside the AuthGuard
@UseGuards(AuthGuard('jwt'), RolesGuard) 
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  // 🚀 GET: /reports/pending
  // 🚀 FIX: Allow Doctors to view pending reports
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.DOCTOR)
  @Get('pending')
  async getPending(@Request() req: any) {
    // req.user.hospitalId comes from your JWT strategy
    return this.reportsService.getPendingForDoctor(req.user.hospitalId);
  }

  // 🚀 PATCH: /reports/:id/review
  // 🚀 FIX: Allow Doctors to review reports
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.DOCTOR)
  @Patch(':id/review')
  async review(@Param('id') id: string) {
    return this.reportsService.markAsReviewed(id);
  }
}