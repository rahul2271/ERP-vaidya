import { 
  Controller, Get, Post, Body, Patch, Param, Delete, Res, 
  UseGuards, Request, BadRequestException, InternalServerErrorException 
} from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { AppointmentsService } from '../appointments/appointments.service';
import { PdfService } from './pdf.service';
import { WhatsAppService } from '../whatsapp/whatsapp.service';
import { HospitalsService } from '../hospitals/hospitals.service';
import type { Response } from 'express';

import { AuthGuard } from '@nestjs/passport'; 
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';
import { RolesGuard } from '../auth/roles.guard';

import * as nodemailer from 'nodemailer';
import { IsNumber } from 'class-validator'; // 🚀 Added import

// 🚀 NEW: DTO to allow the scores through NestJS ValidationPipe
export class SubmitPrakritiDto {
  @IsNumber()
  vata: number;

  @IsNumber()
  pitta: number;

  @IsNumber()
  kapha: number;
}

@Controller('patients')
export class PatientsController {
  constructor(
    private readonly patientsService: PatientsService,
    private readonly appointmentsService: AppointmentsService,
    private readonly pdfService: PdfService,
    private readonly whatsappService: WhatsAppService, 
    private readonly hospitalsService: HospitalsService,
  ) {}

  // 1. CREATE PATIENT
  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.DOCTOR, Role.RECEPTIONIST, Role.TELECALLER) 
  create(@Body() createPatientDto: CreatePatientDto, @Request() req) {
    return this.patientsService.create(createPatientDto, req.user);
  }

  // 2. GET MY PATIENTS (Doctor Specific)
  @Get('my-patients')
  @UseGuards(AuthGuard('jwt'), RolesGuard) 
  @Roles(Role.DOCTOR)
  getMyPatients(@Request() req) {
    return this.patientsService.findByDoctor(req.user.hospitalId, req.user.userId);
  }

  // 3. GET ALL PATIENTS (Strict Multi-Tenancy)
  @Get()
  @UseGuards(AuthGuard('jwt')) 
  findAll(@Request() req) {
    return this.patientsService.findAll(req.user.hospitalId);
  }

  // 4. DISCHARGE SUMMARY
  @Get(':id/discharge-summary')
  @UseGuards(AuthGuard('jwt'))
  async getDischargeSummary(@Param('id') id: string) {
    return this.patientsService.getDischargeSummary(id);
  }

  // 5. DOWNLOAD PDF
  @Get(':id/discharge-pdf')
  @UseGuards(AuthGuard('jwt'))
  async downloadDischargePdf(@Param('id') id: string, @Res() res: Response) {
    const data = await this.patientsService.getDischargeSummary(id);
    const buffer = await this.pdfService.generateDischargePdf(data);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=Discharge_Summary_${data.patientProfile.name.replace(/\s+/g, '_')}.pdf`,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

  // ==================================================================
  // 🚀 6. SEND BILL VIA EMAIL (DYNAMIC SAAS BRANDING)
  // ==================================================================
  @Post(':id/send-bill-email')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.RECEPTIONIST)
  async sendBillEmail(@Param('id') id: string, @Body('email') targetEmail: string, @Request() req) {
    if (!targetEmail) throw new BadRequestException('Email address is required');

    const data = await this.patientsService.getDischargeSummary(id);
    const pdfBuffer = await this.pdfService.generateDischargePdf(data);
    
    const clinicName = data.hospitalDetails?.name || 'Medical Center';

    // Each hospital sends patient-facing email from their own SMTP so it arrives
    // from the clinic's own identity, not a shared platform account.
    const hospital = await this.hospitalsService.findOne(req.user.hospitalId);
    const smtp: any = hospital?.smtpConfig;

    if (!smtp?.host || !smtp?.user || !smtp?.pass) {
      throw new BadRequestException(
        'This clinic has not configured its own email (SMTP) settings yet. Add them under Clinic Settings before sending invoices by email.'
      );
    }

    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port || 587,
      auth: {
        user: smtp.user,
        pass: smtp.pass,
      },
    });

    try {
      await transporter.sendMail({
        from: `"${smtp.fromName || clinicName}" <${smtp.fromEmail || smtp.user}>`,
        to: targetEmail,
        subject: `Your Invoice & Medical Summary - ${clinicName}`,
        text: `Dear ${data.patientProfile.name},\n\nPlease find attached your official invoice and discharge summary from ${clinicName}.\n\nTotal Billed: ₹${data.financialSummary.finalAmount}\nStatus: ${data.financialSummary.paymentStatus}\n\nThank you for trusting us with your care.\n\nRegards,\n${clinicName} Administration`,
        attachments: [
          {
            filename: `Invoice_${data.patientProfile.name.replace(/\s+/g, '_')}.pdf`,
            content: pdfBuffer,
          },
        ],
      });
      return { message: 'Email sent successfully!' };
    } catch (error: any) {
      throw new InternalServerErrorException('Failed to send email: ' + error.message);
    }
  }

  // ==================================================================
  // 🚀 7. SEND BILL VIA WHATSAPP API (WITH PDF ATTACHMENT)
  // ==================================================================
  @Post(':id/send-whatsapp-invoice')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.RECEPTIONIST)
  async sendWhatsappInvoice(@Param('id') id: string, @Request() req) {
    const hospitalId = req.user.hospitalId;
    
    const data = await this.patientsService.getDischargeSummary(id);
    
    if (!data.patientProfile.mobile) {
       throw new BadRequestException("Patient does not have a registered mobile number.");
    }

    const pdfBuffer = await this.pdfService.generateDischargePdf(data);
    const clinicName = data.hospitalDetails?.name || 'Medical Center';

    return this.whatsappService.sendPatientInvoiceWhatsapp(
      hospitalId,
      data.patientProfile.mobile,
      pdfBuffer,
      clinicName
    );
  }

  // ==================================================================
  // 🚀 8. DIGITAL PRAKRITI ASSESSMENT ROUTES
  // ==================================================================

  // 8a. PUBLIC: Fetch the clinic name & patient name for the Mobile UI
  // NOTE: Must be above `:id` routes to prevent routing conflicts!
  @Get('assessment/:token')
  async getPrakritiAssessment(@Param('token') token: string) {
    return this.patientsService.validatePrakritiToken(token);
  }

  // 8b. PUBLIC: Submit the final scores from the Mobile UI
  @Post('assessment/:token')
  async submitPrakritiAssessment(
    @Param('token') token: string, 
    @Body() scores: SubmitPrakritiDto // 🚀 THE FIX: Using the proper DTO!
  ) {
    return this.patientsService.savePrakritiScores(token, scores);
  }

  // 8c. SECURE: Receptionist clicks "Send Quiz" -> Fires WhatsApp
  @Post(':id/send-prakriti-quiz')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.RECEPTIONIST, Role.DOCTOR)
  async sendPrakritiQuiz(@Param('id') id: string, @Request() req) {
    const hospitalId = req.user.hospitalId;
    const patient = await this.patientsService.generatePrakritiToken(id);
    
    if (!patient.mobile) throw new BadRequestException("Patient has no mobile number.");

    // Uses your production frontend URL
    const frontendUrl = process.env.FRONTEND_URL || 'https://erpveda.vercel.app';
    const link = `${frontendUrl}/assessment/${patient.prakritiToken}`;

    const msg = `Hello ${patient.name}! 🌿\n\nWelcome to our clinic. While you wait, please complete this quick 2-minute Ayurvedic health profile to help the doctor understand your body type (Prakriti) better:\n\n👉 ${link}\n\nThank you!`;

    await this.whatsappService.logAndSendMessage(hospitalId, 'UNKNOWN_LEAD', patient.mobile, msg, 'ERP');
    
    return { success: true, message: 'Quiz link sent to WhatsApp!' };
  }

  // ==================================================================
  // EXISTING ROUTES
  // ==================================================================

  @Get(':id/bill')
  @UseGuards(AuthGuard('jwt'))
  async getBill(@Param('id') id: string) {
    return this.appointmentsService.getPatientBillingSummary(id);
  }

  @Get(':id/history')
  @UseGuards(AuthGuard('jwt'))
  getHistory(@Param('id') id: string) {
    return this.appointmentsService.findByPatient(id);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return this.patientsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.DOCTOR)
  update(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
    return this.patientsService.update(id, updatePatientDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard) 
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.patientsService.remove(id);
  }
}