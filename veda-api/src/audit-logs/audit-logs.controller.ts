import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('audit-logs')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  // ONLY Admins can view the God Mode logs
  @Get()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  findAll(@Request() req) {
    return this.auditLogsService.findAllForHospital(req.user.hospitalId);
  }
}