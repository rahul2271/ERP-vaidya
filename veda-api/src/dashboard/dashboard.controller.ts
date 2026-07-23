import { Controller, Get, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @UseGuards(JwtAuthGuard)
  @Get('admin')
  async getAdminDashboard(@Request() req) {
    // Extra layer of security: Ensure the requester is an Admin
    if (req.user.role !== 'ADMIN') {
      throw new UnauthorizedException('Only Hospital Admins can access this dashboard.');
    }
    
    // Pass the hospitalId from the verified JWT token
    return this.dashboardService.getAdminDashboard(req.user.hospitalId);
  }
}