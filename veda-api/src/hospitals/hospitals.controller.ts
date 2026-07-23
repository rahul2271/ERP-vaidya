import { 
  Controller, Get, Post, Body, Patch, Param, Delete, 
  UseGuards, Request, BadRequestException, InternalServerErrorException 
} from '@nestjs/common';
import { HospitalsService } from './hospitals.service';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';

// 🚀 Security Imports
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; 
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';

@Controller('hospitals')
export class HospitalsController {
  constructor(private readonly hospitalsService: HospitalsService) {}

  // ==================================================
  // ✅ CLINIC/TENANT ROUTES (Must be at the TOP)
  // ==================================================

  // 🚀 GET Unified Clinic Settings (Matches Frontend GET /my-clinic)
  @UseGuards(JwtAuthGuard)
  @Get('my-clinic')
  async getMyClinic(@Request() req) {
    const hospitalId = req.user?.hospitalId;
    if (!hospitalId) throw new BadRequestException("No hospital ID found in your token.");
    return this.hospitalsService.findOne(hospitalId);
  }

  // 🚀 UPDATE Unified Clinic Settings (Matches Frontend PATCH /my-clinic)
  @UseGuards(JwtAuthGuard)
  @Patch('my-clinic')
  async updateMyClinic(
    @Request() req, 
    @Body() body: any // Accepts the unified payload (brand + whatsapp config)
  ) {
    console.log("📝 --- INCOMING CLINIC SETTINGS UPDATE ---");
    console.log("User JWT Payload:", req.user);
    console.log("Body Payload:", body);

    const hospitalId = req.user?.hospitalId; 

    if (!hospitalId) {
      console.error("❌ CRITICAL ERROR: req.user.hospitalId is undefined!");
      throw new BadRequestException("Your account is not linked to a valid hospital ID.");
    }

    try {
      // Updates the hospital document with the new unified payload
      const result = await this.hospitalsService.update(hospitalId, body);
      console.log("✅ Successfully updated clinic settings!");
      return result;
    } catch (error) {
      console.error("❌ DATABASE ERROR:", error);
      throw new InternalServerErrorException("Failed to update database. Check backend logs.");
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-plan')
  async getMyPlan(@Request() req) {
    const hospitalId = req.user?.hospitalId;
    if (!hospitalId) return { plan: 'BASIC', subscriptionStatus: 'ACTIVE', isBlocked: false, daysLeft: 0 };

    return this.hospitalsService.getEffectiveStatus(hospitalId);
  }

  // ==================================================
  // ✅ SUPER ADMIN ROUTES (Contains :id parameters)
  // ==================================================

  // 🚀 SUPER ADMIN: Update WhatsApp API for a specific hospital
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Patch(':id/whatsapp-config')
  async updateWhatsAppConfigSuperAdmin(
    @Param('id') id: string, 
    @Body() config: { accessToken: string; phoneId: string; businessAccountId?: string; verifyToken?: string }
  ) {
    return this.hospitalsService.update(id, { whatsappConfig: config });
  }

  // ==================================================
  // ✅ STANDARD CRUD (Protected: SUPER_ADMIN ONLY)
  // ==================================================

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Post()
  create(@Body() createHospitalDto: CreateHospitalDto) {
    return this.hospitalsService.create(createHospitalDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Get()
  findAll() {
    return this.hospitalsService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hospitalsService.findOne(id); 
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHospitalDto: UpdateHospitalDto) {
    return this.hospitalsService.update(id, updateHospitalDto); 
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hospitalsService.remove(id); 
  }
}