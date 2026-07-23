import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { NoticesService } from './notices.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('notices')
export class NoticesController {
  constructor(private readonly noticesService: NoticesService) {}

  // Any authenticated user can submit a notice
  @Post()
  create(@Body() createNoticeDto: any, @Request() req) {
    return this.noticesService.create(createNoticeDto, req.user);
  }

  // Gets the filtered list of notices based on who is asking
  @Get()
  findAll(@Request() req) {
    return this.noticesService.findAll(req.user);
  }

  // ONLY ADMINS can approve or reject
  @Patch(':id/status')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  updateStatus(
    @Param('id') id: string, 
    @Body('status') status: string,
    @Request() req
  ) {
    return this.noticesService.updateStatus(id, status, req.user.hospitalId);
  }

  // ONLY ADMINS can delete
  @Delete(':id')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  remove(@Param('id') id: string, @Request() req) {
    return this.noticesService.remove(id, req.user.hospitalId);
  }
}