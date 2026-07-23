import { Controller, Get, Post, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum'; // 🚀 IMPORT THE ENUM HERE
import { TherapiesService } from './therapies.service';

@Controller('therapies')
@UseGuards(AuthGuard('jwt'), RolesGuard) 
export class TherapiesController {
  constructor(private readonly therapiesService: TherapiesService) {}

  // POST: /therapies (Schedule a therapy)
  @Post()
  @Roles(Role.DOCTOR, Role.RECEPTIONIST, Role.ADMIN) // 🚀 USE THE ENUM HERE
  create(@Body() createDto: any, @Request() req: any) {
    return this.therapiesService.create({
      ...createDto,
      hospitalId: req.user.hospitalId 
    });
  }

  // GET: /therapies/me/today (Fetch schedule for logged-in therapist)
  @Get('me/today')
  @Roles(Role.THERAPIST) // 🚀 USE THE ENUM HERE
  getTodayTherapies(@Request() req: any) {
    const therapistId = req.user.sub || req.user.userId; 
    return this.therapiesService.getTodayTherapiesForTherapist(therapistId, req.user.hospitalId);
  }

  // PUT: /therapies/:id/status (Change status to IN_PROGRESS or COMPLETED)
  @Put(':id/status')
  @Roles(Role.THERAPIST, Role.ADMIN) // 🚀 USE THE ENUM HERE
  updateStatus(@Param('id') id: string, @Body('status') status: string, @Request() req: any) {
    return this.therapiesService.updateStatus(id, status, req.user.hospitalId);
  }
  @Get('me/history')
  @Roles(Role.THERAPIST)
  getTherapyHistory(@Request() req: any) {
    const therapistId = req.user.sub || req.user.userId; 
    return this.therapiesService.getTherapyHistoryForTherapist(therapistId, req.user.hospitalId);
  }

  @Get('patient/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  getPatientTherapies(@Param('id') patientId: string, @Request() req: any) {
    return this.therapiesService.getTherapiesByPatient(patientId, req.user.hospitalId);
  }

  @Get()
  @Roles(Role.DOCTOR, Role.ADMIN, Role.RECEPTIONIST)
  getAllTherapies(@Request() req: any) {
    return this.therapiesService.getAllTherapiesForHospital(req.user.hospitalId);
  }
}