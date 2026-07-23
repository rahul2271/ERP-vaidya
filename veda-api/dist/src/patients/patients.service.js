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
exports.PatientsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const patient_schema_1 = require("./schemas/patient.schema");
const appointment_schema_1 = require("../appointments/schemas/appointment.schema");
const counter_service_1 = require("../common/counter.service");
const audit_logs_service_1 = require("../audit-logs/audit-logs.service");
let PatientsService = class PatientsService {
    appointmentModel;
    patientModel;
    counterService;
    auditLogsService;
    constructor(appointmentModel, patientModel, counterService, auditLogsService) {
        this.appointmentModel = appointmentModel;
        this.patientModel = patientModel;
        this.counterService = counterService;
        this.auditLogsService = auditLogsService;
    }
    async generateUHID(hospitalId, hospitalName) {
        const words = (hospitalName || "Vaidya Clinic").trim().split(/\s+/);
        let initials = "VDA";
        if (words.length > 1) {
            initials = words.map(w => w[0]).join('').substring(0, 3).toUpperCase();
        }
        else if (words.length === 1 && words[0].length >= 3) {
            initials = words[0].substring(0, 3).toUpperCase();
        }
        return this.counterService.generateNumber(hospitalId, 'UHID', initials);
    }
    async create(createDto, user) {
        const hospitalId = user.hospitalId;
        if (!hospitalId) {
            throw new common_1.BadRequestException('Critical Error: Hospital ID missing from user session.');
        }
        const hospital = await this.patientModel.db.model('Hospital').findById(hospitalId);
        const hospitalName = hospital ? hospital['name'] : 'Vaidya Clinic';
        if (createDto.mobile) {
            const existingPatient = await this.patientModel.findOne({
                mobile: createDto.mobile,
                hospitalId: hospitalId
            });
            if (existingPatient) {
                console.log(`[CRM] Patient with mobile ${createDto.mobile} already exists.`);
                let needsSave = false;
                if (!existingPatient.uhid) {
                    existingPatient.uhid = createDto.uhid || await this.generateUHID(hospitalId, hospitalName);
                    needsSave = true;
                }
                if (createDto.assignedDoctorId && !existingPatient.assignedDoctorId) {
                    existingPatient.assignedDoctorId = createDto.assignedDoctorId;
                    needsSave = true;
                }
                if (needsSave)
                    await existingPatient.save();
                return existingPatient;
            }
        }
        const doctorId = user.role?.toUpperCase() === 'DOCTOR'
            ? user.userId
            : (createDto.assignedDoctorId || null);
        const newPatient = new this.patientModel({
            ...createDto,
            uhid: createDto.uhid || await this.generateUHID(hospitalId, hospitalName),
            hospitalId: hospitalId,
            assignedDoctorId: doctorId,
        });
        return await newPatient.save();
    }
    async findByDoctor(hospitalId, doctorId) {
        return this.patientModel.find({
            hospitalId: hospitalId,
            assignedDoctorId: doctorId
        }).sort({ createdAt: -1 }).exec();
    }
    async findAll(hospitalId) {
        const filter = hospitalId ? { hospitalId } : {};
        return this.patientModel.find(filter)
            .populate('hospitalId')
            .sort({ createdAt: -1 })
            .exec();
    }
    async findOne(id) {
        const patient = await this.patientModel.findById(id)
            .populate('hospitalId')
            .populate('assignedDoctorId', 'name email')
            .exec();
        if (!patient)
            throw new common_1.NotFoundException(`Patient #${id} not found`);
        return patient;
    }
    async update(id, updatePatientDto) {
        const patient = await this.patientModel.findById(id).populate('hospitalId').exec();
        if (!patient)
            throw new common_1.NotFoundException('Patient not found');
        if (!patient.uhid && !updatePatientDto.uhid) {
            const hospitalDoc = patient.hospitalId;
            const hospitalName = hospitalDoc?.name || 'Vaidya Clinic';
            const hospitalId = hospitalDoc?._id?.toString() || hospitalDoc?.toString();
            updatePatientDto.uhid = await this.generateUHID(hospitalId, hospitalName);
        }
        return this.patientModel.findByIdAndUpdate(id, updatePatientDto, { new: true }).exec();
    }
    async remove(id) {
        return this.patientModel.findByIdAndDelete(id).exec();
    }
    async getTreatmentHistory(patientId) {
        return this.appointmentModel.find({ patientId })
            .populate('therapistId', 'name')
            .populate('roomId', 'name')
            .select('+chiefComplaints +diagnosis')
            .sort({ startTime: -1 })
            .exec();
    }
    async getDischargeSummary(patientId) {
        const patient = await this.patientModel.findById(patientId)
            .populate('hospitalId')
            .populate('assignedDoctorId', 'name')
            .exec();
        if (!patient)
            throw new common_1.NotFoundException('Patient not found');
        const appointments = await this.appointmentModel.find({
            patientId: patientId,
            status: { $in: ['COMPLETED', 'IN_PROGRESS', 'SCHEDULED'] }
        })
            .select('+chiefComplaints +diagnosis')
            .populate('therapistId', 'name')
            .populate('doctorId', 'name')
            .populate('medicinesUsed.inventoryId', 'name')
            .sort({ startTime: 1 })
            .exec();
        const treatments = appointments.map(app => {
            return {
                date: app.startTime,
                treatment: app.treatmentName,
                status: app.status,
                amount: app.amount || 0,
                vitals: app.vitals || { preBp: '---', postBp: '---', pulse: 'N/A' },
                chiefComplaints: app.chiefComplaints || "",
                diagnosis: app.diagnosis || "",
                medicinesUsed: app.medicinesUsed?.map((m) => ({
                    name: m.inventoryId?.name || 'Ayurvedic Product',
                    quantity: m.quantity,
                    unit: m.inventoryId?.unit || 'Units'
                })) || [],
                therapist: app.therapistId?.name || 'Staff',
                doctor: app.doctorId?.name || null
            };
        });
        let totalBilled = 0;
        let amountPaid = 0;
        appointments.forEach(app => {
            totalBilled += (app.amount || 0);
            if (app.paymentStatus === 'PAID')
                amountPaid += (app.amount || 0);
        });
        const hospital = patient.hospitalId;
        const hospitalLocation = [hospital?.address, hospital?.city, hospital?.state].filter(Boolean).join(", ") || "Mohali, Punjab";
        const latestVisit = appointments[appointments.length - 1];
        const visitType = latestVisit?.visitType || 'OPD';
        const visitNumber = visitType === 'IPD' ? latestVisit?.ipdNumber
            : visitType === 'DAY_CARE' ? latestVisit?.dayCareNumber
                : latestVisit?.opdNumber;
        let conversionHistory = [];
        try {
            const logs = await this.auditLogsService.findAll({
                hospitalId: patient.hospitalId,
                action: { $in: ['PATIENT_ADMITTED', 'PATIENT_DISCHARGED'] },
                details: { $regex: patient.uhid ? patient.uhid.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : patient._id.toString() },
            });
            conversionHistory = logs.map((l) => ({
                action: l.action,
                details: l.details,
                timestamp: l.createdAt,
            }));
        }
        catch (error) {
            console.error('Failed to fetch conversion history for discharge summary:', error);
        }
        return {
            reportDate: new Date().toISOString().split('T')[0],
            hospitalDetails: {
                name: hospital?.name || 'Vaidya Medical Center',
                logo: hospital?.logo || "",
                tagline: hospital?.tagline || "",
                location: hospitalLocation,
                contact: hospital?.phone || 'N/A',
                gstNumber: hospital?.gstNumber || "",
                registrationNumber: hospital?.registrationNumber || ""
            },
            patientProfile: {
                _id: patient._id,
                id: patient._id.toString(),
                uhid: patient.uhid,
                name: patient.name,
                age: patient.age,
                gender: patient.gender,
                mobile: patient.mobile,
                address: patient.address,
                prakritiScores: patient.prakritiScores,
                chiefComplaints: patient.chiefComplaints || "",
                diagnosis: patient.diagnosis || "",
                medicalHistory: patient.medicalHistory || [],
                assignedDoctor: patient.assignedDoctorId?.name || null
            },
            registrationDetails: {
                visitType,
                visitNumber: visitNumber || 'N/A',
                opdNumber: latestVisit?.opdNumber || null,
                ipdNumber: latestVisit?.ipdNumber || null,
                dayCareNumber: latestVisit?.dayCareNumber || null,
                admissionDate: latestVisit?.admissionDate || null,
                dischargeDate: latestVisit?.dischargeDate || null,
                dischargeCondition: latestVisit?.dischargeCondition || null,
                dischargeAdvice: latestVisit?.dischargeAdvice || null,
                nextFollowUpDate: latestVisit?.nextFollowUpDate || null,
            },
            conversionHistory,
            clinicalSummary: {
                totalTreatments: treatments.length,
                treatments: treatments
            },
            financialSummary: {
                finalAmount: totalBilled,
                subtotal: totalBilled,
                totalAmountDue: totalBilled - amountPaid,
                paymentStatus: (totalBilled > 0 && amountPaid >= totalBilled) ? 'PAID' : 'PENDING'
            }
        };
    }
    async generatePrakritiToken(patientId) {
        const token = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
        const patient = await this.patientModel.findByIdAndUpdate(patientId, { prakritiToken: token }, { new: true }).exec();
        if (!patient)
            throw new common_1.NotFoundException('Patient not found');
        return patient;
    }
    async validatePrakritiToken(token) {
        const patient = await this.patientModel.findOne({ prakritiToken: token })
            .populate('hospitalId', 'name logo')
            .exec();
        if (!patient)
            throw new common_1.NotFoundException('Assessment link is invalid or has expired.');
        return {
            name: patient.name,
            hospital: patient.hospitalId,
        };
    }
    async savePrakritiScores(token, scores) {
        const patient = await this.patientModel.findOneAndUpdate({ prakritiToken: token }, {
            prakritiScores: scores,
            prakritiToken: null
        }, { new: true }).exec();
        if (!patient)
            throw new common_1.NotFoundException('Invalid or expired link.');
        return { success: true, message: 'Prakriti Profile Updated!' };
    }
};
exports.PatientsService = PatientsService;
exports.PatientsService = PatientsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(appointment_schema_1.Appointment.name)),
    __param(1, (0, mongoose_1.InjectModel)(patient_schema_1.Patient.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        counter_service_1.CounterService,
        audit_logs_service_1.AuditLogsService])
], PatientsService);
//# sourceMappingURL=patients.service.js.map