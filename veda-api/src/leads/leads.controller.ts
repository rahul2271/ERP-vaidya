import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LeadsService } from './leads.service';

@Controller('leads')
@UseGuards(AuthGuard('jwt'))
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post('bulk')
  bulkUpload(@Body() body: { leads: any[] }, @Request() req: any) {
    return this.leadsService.bulkCreateLeads(body.leads, req.user.hospitalId);
  }

  @Get('admin/all')
  getAllForAdmin(@Request() req: any) {
    return this.leadsService.getAllLeads(req.user.hospitalId);
  }

  @Get('telecaller/mine')
  getMyLeads(@Request() req: any) {
    return this.leadsService.getMyLeads(req.user.userId);
  }

  @Patch(':id/assign')
  assignToTelecaller(@Param('id') id: string, @Body() body: { telecallerId: string }) {
    return this.leadsService.assignLead(id, body.telecallerId);
  }

  @Patch(':id/update')
  updateStatus(@Param('id') id: string, @Body() body: { status: string, notes: string }) {
    return this.leadsService.updateLeadStatus(id, body.status, body.notes);
  }
}