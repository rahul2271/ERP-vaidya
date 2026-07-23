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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../users/schemas/user.schema");
const patient_schema_1 = require("../patients/schemas/patient.schema");
const appointment_schema_1 = require("../appointments/schemas/appointment.schema");
const room_schema_1 = require("../rooms/schemas/room.schema");
let DashboardService = class DashboardService {
    userModel;
    patientModel;
    appointmentModel;
    roomModel;
    constructor(userModel, patientModel, appointmentModel, roomModel) {
        this.userModel = userModel;
        this.patientModel = patientModel;
        this.appointmentModel = appointmentModel;
        this.roomModel = roomModel;
    }
    async getAdminDashboard(hospitalId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const now = new Date();
        const [totalPatients, doctorsCount, staffCount, todaysAppointments, rooms] = await Promise.all([
            this.patientModel.countDocuments({ hospitalId }),
            this.userModel.countDocuments({ hospitalId, role: 'DOCTOR' }),
            this.userModel.countDocuments({ hospitalId, role: { $in: ['NURSE', 'RECEPTIONIST', 'PHARMACIST'] } }),
            this.appointmentModel.find({
                hospitalId,
                startTime: { $gte: today }
            }).populate('doctorId', 'name').populate('patientId', 'name').sort({ startTime: 1 }).limit(5).exec(),
            this.roomModel.find({ hospitalId }).exec(),
        ]);
        const revenue = todaysAppointments.reduce((sum, apt) => sum + (apt.finalBilledAmount || apt.amount || 0), 0);
        const formattedAppointments = todaysAppointments.map((apt) => ({
            id: apt._id,
            patient: apt.patientId?.name || 'Unknown',
            time: new Date(apt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            doctor: apt.doctorId?.name || 'Unassigned',
            status: apt.status || 'Scheduled'
        }));
        const onDutyStaff = await this.userModel.find({
            hospitalId,
            role: { $in: ['DOCTOR', 'NURSE'] }
        }).limit(5).select('name role status').exec();
        const totalBeds = rooms.reduce((sum, r) => sum + (r.capacity || 1), 0);
        const activeRoomIds = await this.appointmentModel.distinct('roomId', {
            hospitalId,
            status: { $in: ['SCHEDULED', 'IN_PROGRESS', 'BOOKED'] },
            startTime: { $lte: now },
            endTime: { $gte: now },
        });
        const occupiedBeds = Math.min(activeRoomIds.length, totalBeds || activeRoomIds.length);
        return {
            stats: {
                totalPatients,
                revenue,
                doctorsCount,
                staffCount
            },
            recentAppointments: formattedAppointments,
            onDutyStaff: onDutyStaff.map(staff => ({
                name: staff.name,
                role: staff.role,
                status: 'Available'
            })),
            beds: { occupied: occupiedBeds, total: totalBeds || 0 },
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(patient_schema_1.Patient.name)),
    __param(2, (0, mongoose_1.InjectModel)(appointment_schema_1.Appointment.name)),
    __param(3, (0, mongoose_1.InjectModel)(room_schema_1.Room.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map