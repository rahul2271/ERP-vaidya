"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentsController = void 0;
const common_1 = require("@nestjs/common");
const appointments_service_1 = require("./appointments.service");
const passport_1 = require("@nestjs/passport");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_enum_1 = require("../auth/roles.enum");
const roles_guard_1 = require("../auth/roles.guard");
let AppointmentsController = class AppointmentsController {
    appointmentsService;
    constructor(appointmentsService) {
        this.appointmentsService = appointmentsService;
    }
    create(createAppointmentDto, req) {
        return this.appointmentsService.create(createAppointmentDto, req.user);
    }
    scheduleSevenDays(baseData, req) {
        return this.appointmentsService.scheduleSevenDays(baseData, req.user);
    }
    findAll(req) {
        if (req.user.role === 'DOCTOR' || req.user.role === 'doctor') {
            return this.appointmentsService.findDoctorAppointments(req.user.hospitalId, req.user.userId);
        }
        return this.appointmentsService.findAll(req.user.hospitalId);
    }
    async getDailyRevenue(req, date) {
        if (!date) {
            date = new Date().toISOString().split('T')[0];
        }
        return this.appointmentsService.getDailyRevenue(req.user.hospitalId, date);
    }
    getRegister(visitType, req) {
        if (!['OPD', 'IPD', 'DAY_CARE'].includes(visitType)) {
            throw new common_1.BadRequestException('visitType must be OPD, IPD, or DAY_CARE.');
        }
        return this.appointmentsService.getRegister(req.user.hospitalId, visitType);
    }
    getUpcomingFollowUps(req) {
        return this.appointmentsService.getUpcomingFollowUps(req.user.hospitalId);
    }
    async getPatientHistory(patientId, req) {
        return this.appointmentsService.getAppointmentsByPatient(patientId, req.user.hospitalId);
    }
    getBilling(id) {
        return this.appointmentsService.getPatientBillingSummary(id);
    }
    findOne(id) {
        return this.appointmentsService.findOne(id);
    }
    update(id, data, req) {
        console.log(`=== CONTROLLER: INCOMING PATCH FOR APPT ${id} ===`, JSON.stringify(data, null, 2));
        return this.appointmentsService.update(id, data, req.user);
    }
    updateVitals(id, vitalsData, req) {
        return this.appointmentsService.recordVitals(id, vitalsData, req.user);
    }
    admitPatient(id, targetType, req) {
        if (!['IPD', 'DAY_CARE'].includes(targetType)) {
            throw new common_1.BadRequestException('targetType must be IPD or DAY_CARE.');
        }
        return this.appointmentsService.admit(id, targetType, req.user.hospitalId, req.user.userId);
    }
    dischargePatient(id, dischargeCondition, dischargeAdvice, req) {
        return this.appointmentsService.discharge(id, req.user.hospitalId, req.user.userId, dischargeCondition, dischargeAdvice);
    }
    async getTicket(id, req, res) {
        const pdfBuffer = await this.appointmentsService.getTicketPdf(id, req.user.hospitalId);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'inline; filename="ticket.pdf"',
            'Content-Length': pdfBuffer.length,
        });
        res.send(pdfBuffer);
    }
    sendTicketWhatsapp(id, req) {
        return this.appointmentsService.sendTicketWhatsapp(id, req.user.hospitalId);
    }
    sendTicketEmail(id, email, req) {
        return this.appointmentsService.sendTicketEmail(id, req.user.hospitalId, email);
    }
    async processRecommendation(body) {
        return this.appointmentsService.handleRecommendation(body);
    }
    async getByDay(date, req) {
        return this.appointmentsService.getDoctorDashboardQueue(req.user.hospitalId, date);
    }
    async getDashboardAnalytics(req) {
        const hospitalId = req.user.hospitalId;
        const today = new Date();
        const startOfToday = new Date(today.setHours(0, 0, 0, 0));
        const endOfToday = new Date(today.setHours(23, 59, 59, 999));
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const allHospitalAppointments = await this.appointmentsService.findAll();
        const todayAppts = allHospitalAppointments.filter(app => {
            const appDate = new Date(app.startTime);
            return appDate >= startOfToday && appDate <= endOfToday;
        });
        const todayRevenue = todayAppts.reduce((sum, app) => sum + (app.finalBilledAmount || app.amount || 0), 0);
        const todayPatients = todayAppts.length;
        const upcomingAppts = allHospitalAppointments.filter(app => new Date(app.startTime) > new Date() && app.status !== 'COMPLETED').length;
        const recentAppts = allHospitalAppointments.filter(app => new Date(app.startTime) >= thirtyDaysAgo && app.status === 'COMPLETED');
        const trendMap = {};
        for (let i = 0; i < 10; i++) {
            const d = new Date();
            d.setDate(d.getDate() - (i * 3));
            trendMap[d.toISOString().split('T')[0]] = 0;
        }
        recentAppts.forEach(app => {
            const dateKey = new Date(app.startTime).toISOString().split('T')[0];
            if (trendMap[dateKey] !== undefined) {
                trendMap[dateKey] += (app.finalBilledAmount || app.amount || 0);
            }
        });
        const revenueTrend = Object.values(trendMap).reverse();
        const doctorStats = {};
        recentAppts.forEach(app => {
            const docName = app.therapistId?.name || app.doctorId?.name || "Attending Doctor";
            if (!doctorStats[docName])
                doctorStats[docName] = { revenue: 0, patients: 0 };
            doctorStats[docName].revenue += (app.finalBilledAmount || app.amount || 0);
            doctorStats[docName].patients += 1;
        });
        const topDoctors = Object.entries(doctorStats)
            .map(([name, stats]) => ({ name, ...stats }))
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 3);
        const therapyStats = {};
        recentAppts.forEach(app => {
            const tName = app.treatmentName || "Consultation";
            therapyStats[tName] = (therapyStats[tName] || 0) + 1;
        });
        const totalTreatments = recentAppts.length || 1;
        const topTherapies = Object.entries(therapyStats)
            .map(([name, count]) => ({ name, percent: Math.round((count / totalTreatments) * 100) }))
            .sort((a, b) => b.percent - a.percent)
            .slice(0, 4);
        return {
            stats: {
                todayPatients,
                todayRevenue,
                upcomingAppts,
                monthlyGrowth: 14.5,
            },
            revenueTrend: revenueTrend.length > 0 ? revenueTrend : [40, 70, 45, 90, 65, 85, 100, 55, 75, 60],
            topDoctors,
            topTherapies
        };
    }
};
exports.AppointmentsController = AppointmentsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.SUPER_ADMIN, roles_enum_1.Role.ADMIN, roles_enum_1.Role.RECEPTIONIST, roles_enum_1.Role.DOCTOR, roles_enum_1.Role.TELECALLER),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('schedule-week'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.SUPER_ADMIN, roles_enum_1.Role.ADMIN, roles_enum_1.Role.RECEPTIONIST, roles_enum_1.Role.DOCTOR),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "scheduleSevenDays", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('daily-revenue'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "getDailyRevenue", null);
__decorate([
    (0, common_1.Get)('register/:visitType'),
    __param(0, (0, common_1.Param)('visitType')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "getRegister", null);
__decorate([
    (0, common_1.Get)('followups/upcoming'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "getUpcomingFollowUps", null);
__decorate([
    (0, common_1.Get)('patient/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "getPatientHistory", null);
__decorate([
    (0, common_1.Get)('patient/:id/billing'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "getBilling", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/vitals'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "updateVitals", null);
__decorate([
    (0, common_1.Patch)(':id/admit'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('targetType')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "admitPatient", null);
__decorate([
    (0, common_1.Patch)(':id/discharge'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('dischargeCondition')),
    __param(2, (0, common_1.Body)('dischargeAdvice')),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "dischargePatient", null);
__decorate([
    (0, common_1.Get)(':id/ticket'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "getTicket", null);
__decorate([
    (0, common_1.Post)(':id/send-ticket-whatsapp'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "sendTicketWhatsapp", null);
__decorate([
    (0, common_1.Post)(':id/send-ticket-email'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('email')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], AppointmentsController.prototype, "sendTicketEmail", null);
__decorate([
    (0, common_1.Post)('process-recommendation'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "processRecommendation", null);
__decorate([
    (0, common_1.Get)('day/:date'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('date')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "getByDay", null);
__decorate([
    (0, common_1.Get)('analytics/dashboard'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "getDashboardAnalytics", null);
exports.AppointmentsController = AppointmentsController = __decorate([
    (0, common_1.Controller)('appointments'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [appointments_service_1.AppointmentsService])
], AppointmentsController);
//# sourceMappingURL=appointments.controller.js.map