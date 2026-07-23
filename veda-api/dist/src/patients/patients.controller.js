"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientsController = exports.SubmitPrakritiDto = void 0;
const common_1 = require("@nestjs/common");
const patients_service_1 = require("./patients.service");
const create_patient_dto_1 = require("./dto/create-patient.dto");
const update_patient_dto_1 = require("./dto/update-patient.dto");
const appointments_service_1 = require("../appointments/appointments.service");
const pdf_service_1 = require("./pdf.service");
const whatsapp_service_1 = require("../whatsapp/whatsapp.service");
const hospitals_service_1 = require("../hospitals/hospitals.service");
const passport_1 = require("@nestjs/passport");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_enum_1 = require("../auth/roles.enum");
const roles_guard_1 = require("../auth/roles.guard");
const nodemailer = __importStar(require("nodemailer"));
const class_validator_1 = require("class-validator");
class SubmitPrakritiDto {
    vata;
    pitta;
    kapha;
}
exports.SubmitPrakritiDto = SubmitPrakritiDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SubmitPrakritiDto.prototype, "vata", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SubmitPrakritiDto.prototype, "pitta", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SubmitPrakritiDto.prototype, "kapha", void 0);
let PatientsController = class PatientsController {
    patientsService;
    appointmentsService;
    pdfService;
    whatsappService;
    hospitalsService;
    constructor(patientsService, appointmentsService, pdfService, whatsappService, hospitalsService) {
        this.patientsService = patientsService;
        this.appointmentsService = appointmentsService;
        this.pdfService = pdfService;
        this.whatsappService = whatsappService;
        this.hospitalsService = hospitalsService;
    }
    create(createPatientDto, req) {
        return this.patientsService.create(createPatientDto, req.user);
    }
    getMyPatients(req) {
        return this.patientsService.findByDoctor(req.user.hospitalId, req.user.userId);
    }
    findAll(req) {
        return this.patientsService.findAll(req.user.hospitalId);
    }
    async getDischargeSummary(id) {
        return this.patientsService.getDischargeSummary(id);
    }
    async downloadDischargePdf(id, res) {
        const data = await this.patientsService.getDischargeSummary(id);
        const buffer = await this.pdfService.generateDischargePdf(data);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=Discharge_Summary_${data.patientProfile.name.replace(/\s+/g, '_')}.pdf`,
            'Content-Length': buffer.length,
        });
        res.end(buffer);
    }
    async sendBillEmail(id, targetEmail, req) {
        if (!targetEmail)
            throw new common_1.BadRequestException('Email address is required');
        const data = await this.patientsService.getDischargeSummary(id);
        const pdfBuffer = await this.pdfService.generateDischargePdf(data);
        const clinicName = data.hospitalDetails?.name || 'Medical Center';
        const hospital = await this.hospitalsService.findOne(req.user.hospitalId);
        const smtp = hospital?.smtpConfig;
        if (!smtp?.host || !smtp?.user || !smtp?.pass) {
            throw new common_1.BadRequestException('This clinic has not configured its own email (SMTP) settings yet. Add them under Clinic Settings before sending invoices by email.');
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
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to send email: ' + error.message);
        }
    }
    async sendWhatsappInvoice(id, req) {
        const hospitalId = req.user.hospitalId;
        const data = await this.patientsService.getDischargeSummary(id);
        if (!data.patientProfile.mobile) {
            throw new common_1.BadRequestException("Patient does not have a registered mobile number.");
        }
        const pdfBuffer = await this.pdfService.generateDischargePdf(data);
        const clinicName = data.hospitalDetails?.name || 'Medical Center';
        return this.whatsappService.sendPatientInvoiceWhatsapp(hospitalId, data.patientProfile.mobile, pdfBuffer, clinicName);
    }
    async getPrakritiAssessment(token) {
        return this.patientsService.validatePrakritiToken(token);
    }
    async submitPrakritiAssessment(token, scores) {
        return this.patientsService.savePrakritiScores(token, scores);
    }
    async sendPrakritiQuiz(id, req) {
        const hospitalId = req.user.hospitalId;
        const patient = await this.patientsService.generatePrakritiToken(id);
        if (!patient.mobile)
            throw new common_1.BadRequestException("Patient has no mobile number.");
        const frontendUrl = process.env.FRONTEND_URL || 'https://erpveda.vercel.app';
        const link = `${frontendUrl}/assessment/${patient.prakritiToken}`;
        const msg = `Hello ${patient.name}! 🌿\n\nWelcome to our clinic. While you wait, please complete this quick 2-minute Ayurvedic health profile to help the doctor understand your body type (Prakriti) better:\n\n👉 ${link}\n\nThank you!`;
        await this.whatsappService.logAndSendMessage(hospitalId, 'UNKNOWN_LEAD', patient.mobile, msg, 'ERP');
        return { success: true, message: 'Quiz link sent to WhatsApp!' };
    }
    async getBill(id) {
        return this.appointmentsService.getPatientBillingSummary(id);
    }
    getHistory(id) {
        return this.appointmentsService.findByPatient(id);
    }
    findOne(id) {
        return this.patientsService.findOne(id);
    }
    update(id, updatePatientDto) {
        return this.patientsService.update(id, updatePatientDto);
    }
    remove(id) {
        return this.patientsService.remove(id);
    }
};
exports.PatientsController = PatientsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.SUPER_ADMIN, roles_enum_1.Role.ADMIN, roles_enum_1.Role.DOCTOR, roles_enum_1.Role.RECEPTIONIST, roles_enum_1.Role.TELECALLER),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_patient_dto_1.CreatePatientDto, Object]),
    __metadata("design:returntype", void 0)
], PatientsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('my-patients'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.DOCTOR),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PatientsController.prototype, "getMyPatients", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PatientsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id/discharge-summary'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "getDischargeSummary", null);
__decorate([
    (0, common_1.Get)(':id/discharge-pdf'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "downloadDischargePdf", null);
__decorate([
    (0, common_1.Post)(':id/send-bill-email'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN, roles_enum_1.Role.SUPER_ADMIN, roles_enum_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('email')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "sendBillEmail", null);
__decorate([
    (0, common_1.Post)(':id/send-whatsapp-invoice'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN, roles_enum_1.Role.SUPER_ADMIN, roles_enum_1.Role.RECEPTIONIST),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "sendWhatsappInvoice", null);
__decorate([
    (0, common_1.Get)('assessment/:token'),
    __param(0, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "getPrakritiAssessment", null);
__decorate([
    (0, common_1.Post)('assessment/:token'),
    __param(0, (0, common_1.Param)('token')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, SubmitPrakritiDto]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "submitPrakritiAssessment", null);
__decorate([
    (0, common_1.Post)(':id/send-prakriti-quiz'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN, roles_enum_1.Role.RECEPTIONIST, roles_enum_1.Role.DOCTOR),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "sendPrakritiQuiz", null);
__decorate([
    (0, common_1.Get)(':id/bill'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PatientsController.prototype, "getBill", null);
__decorate([
    (0, common_1.Get)(':id/history'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PatientsController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PatientsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.SUPER_ADMIN, roles_enum_1.Role.ADMIN, roles_enum_1.Role.DOCTOR),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_patient_dto_1.UpdatePatientDto]),
    __metadata("design:returntype", void 0)
], PatientsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN, roles_enum_1.Role.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PatientsController.prototype, "remove", null);
exports.PatientsController = PatientsController = __decorate([
    (0, common_1.Controller)('patients'),
    __metadata("design:paramtypes", [patients_service_1.PatientsService,
        appointments_service_1.AppointmentsService,
        pdf_service_1.PdfService,
        whatsapp_service_1.WhatsAppService,
        hospitals_service_1.HospitalsService])
], PatientsController);
//# sourceMappingURL=patients.controller.js.map