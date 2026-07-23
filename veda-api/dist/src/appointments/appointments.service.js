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
exports.AppointmentsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const appointment_schema_1 = require("./schemas/appointment.schema");
const treatment_schema_1 = require("../treatments/schemas/treatment.schema");
const counter_service_1 = require("../common/counter.service");
const hospitals_service_1 = require("../hospitals/hospitals.service");
const pdf_service_1 = require("../patients/pdf.service");
const audit_logs_service_1 = require("../audit-logs/audit-logs.service");
const nodemailer = __importStar(require("nodemailer"));
const whatsapp_service_1 = require("../whatsapp/whatsapp.service");
let AppointmentsService = class AppointmentsService {
    appointmentModel;
    treatmentModel;
    whatsappService;
    counterService;
    hospitalsService;
    pdfService;
    auditLogsService;
    constructor(appointmentModel, treatmentModel, whatsappService, counterService, hospitalsService, pdfService, auditLogsService) {
        this.appointmentModel = appointmentModel;
        this.treatmentModel = treatmentModel;
        this.whatsappService = whatsappService;
        this.counterService = counterService;
        this.hospitalsService = hospitalsService;
        this.pdfService = pdfService;
        this.auditLogsService = auditLogsService;
    }
    async create(createDto, user) {
        const { patientId, treatmentName, startTime, duration, amount } = createDto;
        const start = new Date(startTime);
        if (isNaN(start.getTime()))
            throw new common_1.BadRequestException('Invalid start time.');
        const end = new Date(start.getTime() + (duration || 60) * 60000);
        const fallbackId = user?.userId || new mongoose_2.Types.ObjectId();
        const therapistId = createDto.therapistId || fallbackId;
        const doctorId = createDto.doctorId || fallbackId;
        const roomId = createDto.roomId || new mongoose_2.Types.ObjectId();
        const hospitalId = user?.hospitalId || createDto.hospitalId;
        if (!hospitalId)
            throw new common_1.BadRequestException('Hospital ID is required.');
        const visitType = (createDto.visitType || 'OPD').toUpperCase();
        const registrationNumber = await this.counterService.generateNumber(hospitalId, visitType);
        const numberField = visitType === 'IPD' ? 'ipdNumber' : visitType === 'DAY_CARE' ? 'dayCareNumber' : 'opdNumber';
        let finalAmount = amount;
        if (!finalAmount) {
            const rateCard = await this.treatmentModel.findOne({
                name: { $regex: new RegExp(`^${treatmentName.trim()}$`, 'i') }
            });
            finalAmount = rateCard ? rateCard.cost : 0;
        }
        const newAppointment = new this.appointmentModel({
            ...createDto,
            patientId,
            treatmentName,
            startTime: start,
            endTime: end,
            therapistId,
            doctorId,
            roomId,
            hospitalId,
            amount: finalAmount,
            status: 'SCHEDULED',
            bookedById: user?.userId || null,
            visitType,
            [numberField]: registrationNumber,
            admissionDate: visitType !== 'OPD' ? new Date() : null,
        });
        try {
            const savedAppt = await newAppointment.save();
            try {
                await savedAppt.populate('patientId', 'name mobile');
                await savedAppt.populate('doctorId', 'name');
                const patient = savedAppt.patientId;
                const doc = savedAppt.doctorId;
                if (patient && patient.mobile) {
                    const dateStr = start.toLocaleDateString('en-IN', {
                        timeZone: 'Asia/Kolkata',
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric'
                    });
                    const timeStr = start.toLocaleTimeString('en-IN', {
                        timeZone: 'Asia/Kolkata',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                    this.whatsappService.sendAppointmentConfirmation(savedAppt.hospitalId.toString(), patient.mobile, patient.name, `Dr. ${doc.name}`, dateStr, timeStr).catch(err => console.error("WhatsApp async delivery failed:", err.message));
                }
            }
            catch (waErr) {
                console.error("Failed to process WhatsApp notification:", waErr.message);
            }
            return savedAppt;
        }
        catch (error) {
            if (error.code === 11000) {
                throw new common_1.ConflictException('Conflict: This slot was just booked by another staff member. Please select another time.');
            }
            throw new common_1.InternalServerErrorException('Failed to schedule appointment.');
        }
    }
    async scheduleSevenDays(baseData, user) {
        const appointments = [];
        const firstStart = new Date(baseData.startTime);
        for (let i = 0; i < 7; i++) {
            const dailyStart = new Date(firstStart);
            dailyStart.setDate(firstStart.getDate() + i);
            const newAppt = await this.create({
                ...baseData,
                startTime: dailyStart,
            }, user);
            appointments.push(newAppt);
        }
        return appointments;
    }
    async recordVitals(id, vitalsData, user) {
        const appointment = await this.findOne(id);
        const apptDoctorId = appointment.doctorId?._id?.toString() || appointment.doctorId?.toString();
        if (user.role?.toUpperCase() === 'DOCTOR' && apptDoctorId !== user.userId) {
            throw new common_1.UnauthorizedException('Access Denied: You cannot modify vitals for another doctor\'s patient.');
        }
        return this.appointmentModel.findByIdAndUpdate(id, {
            $set: { vitals: vitalsData },
            status: vitalsData.postBp ? 'COMPLETED' : 'IN_PROGRESS'
        }, { new: true }).exec();
    }
    async update(id, data, user) {
        const appointment = await this.findOne(id);
        const apptDoctorId = appointment.doctorId?._id?.toString() || appointment.doctorId?.toString();
        if (user.role?.toUpperCase() === 'DOCTOR' && apptDoctorId !== user.userId) {
            throw new common_1.UnauthorizedException('Access Denied: You can only complete sessions for your assigned patients.');
        }
        if (data.medicines || data.medicinesUsed) {
            const medsToUpdate = data.medicines || data.medicinesUsed;
            data.medicinesUsed = medsToUpdate.map((m) => ({
                inventoryId: m.inventoryId,
                quantity: Number(m.quantity) || 1,
                priceAtTime: Number(m.price || m.priceAtTime || 0)
            }));
            delete data.medicines;
        }
        return this.appointmentModel.findByIdAndUpdate(id, { $set: data }, { new: true }).populate('medicinesUsed.inventoryId').exec();
    }
    async getPatientBillingSummary(patientId) {
        try {
            const todayStart = new Date();
            todayStart.setHours(0, 0, 0, 0);
            const appointments = await this.appointmentModel
                .find({
                patientId,
                status: { $in: ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'BOOKED'] },
                $or: [
                    { paymentStatus: { $ne: 'PAID' } },
                    { updatedAt: { $gte: todayStart } }
                ]
            })
                .populate('medicinesUsed.inventoryId')
                .sort({ startTime: -1 })
                .exec();
            let therapyTotal = 0;
            let pharmacyTotal = 0;
            let totalDiscount = 0;
            let amountPaid = 0;
            const therapyRows = [];
            const pharmacyRows = [];
            appointments.forEach(app => {
                const serviceCost = app.amount || 0;
                let sessionTotal = serviceCost;
                if (serviceCost > 0) {
                    therapyTotal += serviceCost;
                    therapyRows.push({
                        id: app._id.toString(),
                        date: app.startTime,
                        name: app.treatmentName,
                        cost: serviceCost
                    });
                }
                if (app.medicinesUsed && app.medicinesUsed.length > 0) {
                    app.medicinesUsed.forEach((med) => {
                        const price = med.priceAtTime || med.inventoryId?.price || 0;
                        const lineTotal = price * med.quantity;
                        pharmacyTotal += lineTotal;
                        sessionTotal += lineTotal;
                        pharmacyRows.push({
                            date: app.startTime,
                            name: med.inventoryId?.name || "Unknown Item",
                            qty: med.quantity,
                            unitPrice: price,
                            total: lineTotal
                        });
                    });
                }
                if (app.discount && app.discount.amount) {
                    totalDiscount += app.discount.amount;
                    sessionTotal -= app.discount.amount;
                }
                if (app.paymentStatus === 'PAID') {
                    amountPaid += sessionTotal;
                }
            });
            const subtotal = therapyTotal + pharmacyTotal;
            const grandTotal = subtotal - totalDiscount;
            const balanceDue = grandTotal - amountPaid;
            return {
                patientId,
                billDate: new Date(),
                completedSessions: appointments.length,
                sections: {
                    therapies: { title: "Panchakarma Procedures", items: therapyRows, total: therapyTotal },
                    medicines: { title: "Pharmacy / Medicines", items: pharmacyRows, total: pharmacyTotal }
                },
                subtotal: subtotal,
                totalDiscount: totalDiscount,
                finalAmount: grandTotal,
                amountPaid: amountPaid,
                balanceDue: balanceDue,
                totalDue: `₹${balanceDue}`,
                paymentStatus: balanceDue <= 0 && grandTotal > 0 ? 'PAID' : 'PAYMENT DUE',
                status: "Success"
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Billing calculation failed: ' + error.message);
        }
    }
    async getDailyRevenue(hospitalId, date) {
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);
        const completedAppointments = await this.appointmentModel.find({
            hospitalId,
            status: 'COMPLETED',
            startTime: { $gte: start, $lte: end }
        }).populate('medicinesUsed.inventoryId');
        let totalRevenue = 0;
        completedAppointments.forEach(app => {
            let sessionTotal = (app.amount || 0);
            if (app.medicinesUsed && Array.isArray(app.medicinesUsed)) {
                const medCost = app.medicinesUsed.reduce((sum, item) => {
                    const price = item.priceAtTime || item.inventoryId?.price || 0;
                    return sum + (price * item.quantity);
                }, 0);
                sessionTotal += medCost;
            }
            if (app.discount && app.discount.amount) {
                sessionTotal -= app.discount.amount;
            }
            totalRevenue += sessionTotal;
        });
        return { date, completedSessions: completedAppointments.length, totalRevenue: `₹${totalRevenue}` };
    }
    async findDoctorAppointments(hospitalId, doctorId) {
        return this.appointmentModel.find({ hospitalId, doctorId })
            .populate('patientId', 'name mobile prakritiScores')
            .populate('therapistId', 'name')
            .populate('doctorId', 'name')
            .populate('roomId', 'name')
            .populate('medicinesUsed.inventoryId', 'name price unit')
            .populate('bookedById', 'name')
            .sort({ startTime: 1 }).exec();
    }
    async findAll(hospitalId) {
        const filter = hospitalId ? { hospitalId } : {};
        return this.appointmentModel.find(filter)
            .populate('patientId', 'name mobile prakritiScores')
            .populate('therapistId', 'name')
            .populate('doctorId', 'name')
            .populate('roomId', 'name')
            .populate('medicinesUsed.inventoryId', 'name price unit')
            .populate('bookedById', 'name')
            .sort({ startTime: 1 }).exec();
    }
    async findByPatient(patientId) {
        return this.appointmentModel.find({ patientId })
            .populate({ path: 'medicinesUsed.inventoryId', select: 'name price unit' })
            .populate('doctorId', 'name')
            .populate('therapistId', 'name')
            .populate('bookedById', 'name')
            .sort({ startTime: -1 }).exec();
    }
    async findOne(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id))
            throw new common_1.BadRequestException(`Invalid ID: ${id}`);
        const appointment = await this.appointmentModel.findById(id)
            .populate({ path: 'patientId', populate: { path: 'assignedDoctorId', select: 'name' } })
            .populate('therapistId', 'name')
            .populate('doctorId', 'name')
            .populate('roomId', 'name')
            .populate('medicinesUsed.inventoryId', 'name price unit')
            .populate('bookedById', 'name')
            .exec();
        if (!appointment)
            throw new common_1.NotFoundException(`Appointment not found`);
        return appointment;
    }
    async cleanupPlaceholderRecords() {
        const result = await this.appointmentModel.deleteMany({
            $or: [{ doctorId: { $type: "string" } }, { therapistId: { $type: "string" } }, { roomId: { $type: "string" } }]
        }).exec();
        return { message: 'Cleanup successful', deletedCount: result.deletedCount };
    }
    async handleRecommendation(data) {
        const { originalApptId, therapyId, action, patientId, treatmentName, startTime, roomId, therapistId } = data;
        await this.appointmentModel.updateOne({ _id: originalApptId, 'recommendedTherapies._id': therapyId }, { $set: { 'recommendedTherapies.$.isProcessed': true } });
        if (action === 'BOOK') {
            const treatment = await this.treatmentModel.findOne({
                name: { $regex: new RegExp(`^${treatmentName.trim()}$`, 'i') }
            });
            const price = treatment ? treatment.cost || treatment.price : 0;
            const originalAppt = await this.appointmentModel.findById(originalApptId);
            if (!originalAppt)
                throw new common_1.NotFoundException('Original appointment record not found.');
            const sessionStart = startTime ? new Date(startTime) : new Date();
            const sessionEnd = new Date(sessionStart.getTime() + 60 * 60000);
            return await this.appointmentModel.create({
                patientId,
                treatmentName,
                status: 'SCHEDULED',
                amount: price,
                startTime: sessionStart,
                endTime: sessionEnd,
                hospitalId: originalAppt.hospitalId,
                doctorId: originalAppt.doctorId,
                therapistId: therapistId || originalAppt.therapistId,
                roomId: roomId || originalAppt.roomId
            });
        }
        return { message: 'Recommendation marked as not taken.' };
    }
    async getAppointmentsByPatient(patientId, hospitalId) {
        return this.appointmentModel.find({
            patientId: patientId,
            hospitalId: hospitalId
        })
            .populate('doctorId', 'name')
            .populate('roomId', 'name')
            .populate('bookedById', 'name')
            .sort({ createdAt: -1 })
            .exec();
    }
    async getTodayAppointments(hospitalId) {
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const end = new Date();
        end.setHours(23, 59, 59, 999);
        return this.appointmentModel.find({
            hospitalId,
            startTime: { $gte: start, $lte: end },
            status: { $ne: 'CANCELLED' }
        })
            .populate('patientId', 'name prakritiScores')
            .populate('doctorId', 'name')
            .populate('roomId', 'name')
            .populate('bookedById', 'name')
            .sort({ startTime: 1 })
            .exec();
    }
    async getDoctorDashboardQueue(hospitalId, dateStr) {
        const start = new Date(dateStr);
        start.setHours(0, 0, 0, 0);
        const end = new Date(dateStr);
        end.setHours(23, 59, 59, 999);
        return this.appointmentModel.find({
            hospitalId: hospitalId,
            startTime: { $gte: start, $lte: end },
            status: { $ne: 'CANCELLED' }
        })
            .populate('patientId', 'name prakritiScores')
            .populate('doctorId', 'name')
            .populate('roomId', 'name')
            .populate('bookedById', 'name')
            .sort({ startTime: 1 })
            .exec();
    }
    async admit(id, targetType, hospitalId, userId) {
        if (!hospitalId) {
            throw new common_1.BadRequestException('No hospital linked to your session. Please log out and back in.');
        }
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid appointment ID.');
        }
        try {
            const existing = await this.appointmentModel.findOne({ _id: id, hospitalId }).populate('patientId', 'name uhid').exec();
            if (!existing)
                throw new common_1.NotFoundException('Appointment not found.');
            if (existing.visitType && existing.visitType !== 'OPD') {
                throw new common_1.BadRequestException(`This visit is already ${existing.visitType}, not OPD — cannot admit again.`);
            }
            const registrationNumber = await this.counterService.generateNumber(hospitalId, targetType);
            const numberField = targetType === 'IPD' ? 'ipdNumber' : 'dayCareNumber';
            const updated = await this.appointmentModel.findByIdAndUpdate(id, { visitType: targetType, [numberField]: registrationNumber, admissionDate: new Date() }, { new: true, runValidators: false }).exec();
            try {
                const patientInfo = existing.patientId;
                await this.auditLogsService.logAction(hospitalId, userId, 'PATIENT_ADMITTED', 'CLINICAL', `${patientInfo?.name || 'Patient'} (UHID: ${patientInfo?.uhid || 'N/A'}) admitted from OPD (${existing.opdNumber || 'N/A'}) to ${targetType} (${registrationNumber}).`);
            }
            catch (auditError) {
                console.error('Failed to log admission audit event:', auditError);
            }
            return updated;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException)
                throw error;
            console.error('[AppointmentsService.admit] Unexpected error:', error);
            throw new common_1.InternalServerErrorException('Failed to admit patient — see server logs for details.');
        }
    }
    async discharge(id, hospitalId, userId, dischargeCondition, dischargeAdvice) {
        if (!hospitalId) {
            throw new common_1.BadRequestException('No hospital linked to your session. Please log out and back in.');
        }
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid appointment ID.');
        }
        try {
            const existing = await this.appointmentModel.findOne({ _id: id, hospitalId }).populate('patientId', 'name uhid').exec();
            if (!existing)
                throw new common_1.NotFoundException('Appointment not found.');
            if (existing.visitType === 'OPD') {
                throw new common_1.BadRequestException('This is an OPD visit — nothing to discharge.');
            }
            const updated = await this.appointmentModel.findByIdAndUpdate(id, {
                dischargeDate: new Date(),
                dischargeCondition: dischargeCondition || null,
                dischargeAdvice: dischargeAdvice || null,
            }, { new: true, runValidators: false }).exec();
            try {
                const patientInfo = existing.patientId;
                const regNumber = existing.visitType === 'IPD' ? existing.ipdNumber : existing.dayCareNumber;
                await this.auditLogsService.logAction(hospitalId, userId, 'PATIENT_DISCHARGED', 'CLINICAL', `${patientInfo?.name || 'Patient'} (UHID: ${patientInfo?.uhid || 'N/A'}) discharged from ${existing.visitType} (${regNumber || 'N/A'}).`);
            }
            catch (auditError) {
                console.error('Failed to log discharge audit event:', auditError);
            }
            return updated;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException)
                throw error;
            console.error('[AppointmentsService.discharge] Unexpected error:', error);
            throw new common_1.InternalServerErrorException('Failed to discharge patient — see server logs for details.');
        }
    }
    async getRegister(hospitalId, visitType) {
        return this.appointmentModel.find({ hospitalId, visitType })
            .populate('patientId', 'name uhid mobile age gender')
            .populate('doctorId', 'name')
            .populate('roomId', 'name')
            .sort({ startTime: -1 })
            .limit(200)
            .exec();
    }
    async getUpcomingFollowUps(hospitalId) {
        const today = new Date().toISOString().split('T')[0];
        return this.appointmentModel.find({
            hospitalId,
            nextFollowUpDate: { $ne: null, $exists: true, $gte: today },
        })
            .populate('patientId', 'name uhid mobile')
            .populate('doctorId', 'name')
            .sort({ nextFollowUpDate: 1 })
            .limit(200)
            .exec();
    }
    async buildTicketBuffer(appointmentId, hospitalId) {
        const appt = await this.appointmentModel.findOne({ _id: appointmentId, hospitalId })
            .populate('patientId', 'name age gender uhid mobile email')
            .populate('doctorId', 'name')
            .populate('roomId', 'name')
            .exec();
        if (!appt)
            throw new common_1.NotFoundException('Appointment not found.');
        const hospital = await this.hospitalsService.findOne(hospitalId);
        const patient = appt.patientId;
        const doctor = appt.doctorId;
        const room = appt.roomId;
        const visitType = appt.visitType || 'OPD';
        const visitNumber = visitType === 'IPD' ? appt.ipdNumber : visitType === 'DAY_CARE' ? appt.dayCareNumber : appt.opdNumber;
        const pdfBuffer = await this.pdfService.generateVisitTicketPdf({
            hospital: { name: hospital?.name || 'Vaidya Clinic', location: hospital?.city, contact: hospital?.phone },
            patient: { name: patient?.name, age: patient?.age, gender: patient?.gender, uhid: patient?.uhid },
            visitType,
            visitNumber: visitNumber || 'PENDING',
            doctorName: doctor?.name,
            treatmentName: appt.treatmentName,
            roomName: room?.name,
            dateTime: new Date(appt.startTime),
        });
        return { pdfBuffer, patient, hospital, visitType, visitNumber };
    }
    async getTicketPdf(appointmentId, hospitalId) {
        const { pdfBuffer } = await this.buildTicketBuffer(appointmentId, hospitalId);
        return pdfBuffer;
    }
    async sendTicketWhatsapp(appointmentId, hospitalId) {
        const { pdfBuffer, patient, hospital, visitType, visitNumber } = await this.buildTicketBuffer(appointmentId, hospitalId);
        if (!patient?.mobile)
            throw new common_1.BadRequestException('This patient has no mobile number on file.');
        return this.whatsappService.sendVisitTicketWhatsapp(hospitalId, patient.mobile, pdfBuffer, hospital?.name || 'Vaidya Clinic', visitType, visitNumber);
    }
    async sendTicketEmail(appointmentId, hospitalId, targetEmail) {
        if (!targetEmail)
            throw new common_1.BadRequestException('Email address is required.');
        const { pdfBuffer, patient, hospital, visitType, visitNumber } = await this.buildTicketBuffer(appointmentId, hospitalId);
        const smtp = hospital?.smtpConfig;
        if (!smtp?.host || !smtp?.user || !smtp?.pass) {
            throw new common_1.BadRequestException('This clinic has not configured its own email (SMTP) settings yet. Add them under Clinic Settings before sending tickets by email.');
        }
        const transporter = nodemailer.createTransport({
            host: smtp.host,
            port: smtp.port || 587,
            auth: { user: smtp.user, pass: smtp.pass },
        });
        const typeLabel = visitType === 'DAY_CARE' ? 'Day Care' : visitType;
        const clinicName = hospital?.name || 'Vaidya Clinic';
        await transporter.sendMail({
            from: `"${smtp.fromName || clinicName}" <${smtp.fromEmail || smtp.user}>`,
            to: targetEmail,
            subject: `Your ${typeLabel} Ticket — ${clinicName} (${visitNumber})`,
            text: `Dear ${patient?.name},\n\nPlease find attached your ${typeLabel} registration ticket from ${clinicName}.\n\nVisit Number: ${visitNumber}\n\nPlease keep this for your records and bring it for follow-up visits.\n\nRegards,\n${clinicName}`,
            attachments: [{ filename: `${typeLabel}_Ticket.pdf`, content: pdfBuffer }],
        });
        return { message: 'Ticket emailed successfully.' };
    }
};
exports.AppointmentsService = AppointmentsService;
exports.AppointmentsService = AppointmentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(appointment_schema_1.Appointment.name)),
    __param(1, (0, mongoose_1.InjectModel)(treatment_schema_1.Treatment.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        whatsapp_service_1.WhatsAppService,
        counter_service_1.CounterService,
        hospitals_service_1.HospitalsService,
        pdf_service_1.PdfService,
        audit_logs_service_1.AuditLogsService])
], AppointmentsService);
//# sourceMappingURL=appointments.service.js.map