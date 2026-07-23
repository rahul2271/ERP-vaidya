import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; 

import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';
import { RolesGuard } from '../auth/roles.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ==================================================
  // ✅ CUSTOM DASHBOARD ROUTES (Must be FIRST)
  // ==================================================

  // 1. Admin & Doctor Dashboard Stats
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.DOCTOR)
  @Get('stats')
  async getStats(@Request() req) {
    return this.usersService.getHospitalStaffStats(req.user.hospitalId);
  }

  // 2. Doctors route (For dropdowns)
  @Get('doctors')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.RECEPTIONIST, Role.TELECALLER)
  async getDoctors(@Request() req) {
    return this.usersService.findByRole('DOCTOR', req.user.hospitalId);
  }

  // 🚀 Fetch any staff by Role (e.g. Therapists, Callers)
  @Get('role/:role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.RECEPTIONIST)
  async getUsersByRole(@Param('role') role: string, @Request() req) {
    return this.usersService.findByRole(role, req.user.hospitalId);
  }

  // 3. Add New Staff (Admin Shortcut)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Post('add-staff')
  async addStaff(@Body() createUserDto: CreateUserDto, @Request() req) {
    // 🚀 TENANT ISOLATION FIX: 
    // If SUPER_ADMIN provides a hospitalId, use it. Otherwise, strictly force the logged-in admin's hospitalId.
    const isSuperAdmin = req.user.role === Role.SUPER_ADMIN;
    const targetHospitalId = (isSuperAdmin && createUserDto.hospitalId) 
      ? createUserDto.hospitalId 
      : req.user.hospitalId;

    return this.usersService.create({
      ...createUserDto,
      hospitalId: targetHospitalId, 
      password: createUserDto.password || 'Staff@123' 
    });
  }

  // 4. Doctor: Get My Patients
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DOCTOR)
  @Get('my-patients')
  async getMyPatients(@Request() req) {
    return this.usersService.findPatientsByHospital(req.user.hospitalId);
  }

  // 5. Doctor/Receptionist: Add New Patient
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DOCTOR, Role.RECEPTIONIST)
  @Post('add-patient')
  async addPatient(@Body() createUserDto: CreateUserDto, @Request() req) {
    // Automatically binds the patient to the clinic
    return this.usersService.create({
      ...createUserDto,
      hospitalId: req.user.hospitalId,
      role: 'PATIENT', 
      password: createUserDto.password || 'Patient@123' 
    });
  }

  // ==================================================
  // ✅ STANDARD CRUD (Must be AFTER custom routes)
  // ==================================================

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Post()
  create(@Body() createUserDto: CreateUserDto, @Request() req) {
    const isSuperAdmin = req.user.role === Role.SUPER_ADMIN;
    const targetHospitalId = (isSuperAdmin && createUserDto.hospitalId) ? createUserDto.hospitalId : req.user.hospitalId;
    
    return this.usersService.create({
      ...createUserDto,
      hospitalId: targetHospitalId
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.RECEPTIONIST, Role.DOCTOR, Role.TELECALLER)
  @Get()
  findAll(@Request() req) {
    // 🚀 TENANT ISOLATION FIX: Pass the user's role and hospitalId to the service
    return this.usersService.findAll(req.user.role, req.user.hospitalId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  // 🚀 NEW: Passed @Request() req down to track WHO is updating the record
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Request() req) {
    return this.usersService.update(id, updateUserDto, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}