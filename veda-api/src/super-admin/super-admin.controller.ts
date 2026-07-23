import { Controller, Get, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('super-admin')
export class SuperAdminController {
  constructor(private readonly superAdminService: SuperAdminService) {}

  @UseGuards(JwtAuthGuard)
  @Get('metrics')
  async getMetrics(@Request() req) {
    // Extra layer of security: Ensure the requester is actually the Super Admin
    if (req.user.role !== 'SUPER_ADMIN') {
      throw new UnauthorizedException('Strictly Super Admin access only.');
    }
    
    return this.superAdminService.getDashboardMetrics();
  }
}