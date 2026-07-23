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
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("./schemas/user.schema");
const bcrypt = __importStar(require("bcrypt"));
const audit_logs_service_1 = require("../audit-logs/audit-logs.service");
let UsersService = UsersService_1 = class UsersService {
    userModel;
    hospitalModel;
    auditLogsService;
    logger = new common_1.Logger(UsersService_1.name);
    constructor(userModel, hospitalModel, auditLogsService) {
        this.userModel = userModel;
        this.hospitalModel = hospitalModel;
        this.auditLogsService = auditLogsService;
    }
    async create(createUserDto) {
        const hospitalId = createUserDto.hospitalId;
        if (hospitalId) {
            const hospital = await this.hospitalModel.findById(hospitalId);
            const isStaff = !['PATIENT', 'patient'].includes(createUserDto.role);
            if (hospital && isStaff && hospital.plan === 'BASIC') {
                const currentStaffCount = await this.userModel.countDocuments({
                    hospitalId,
                    role: { $nin: ['PATIENT', 'patient'] }
                });
                if (currentStaffCount >= 6) {
                    throw new common_1.ForbiddenException('BASIC_LIMIT_REACHED: Basic plan allows a maximum of 6 staff members.');
                }
                createUserDto.permissions = {
                    canViewFinancials: true,
                    canEditInventory: true,
                    canExportData: false
                };
            }
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
        const createdUser = new this.userModel({
            ...createUserDto,
            password: hashedPassword,
        });
        return createdUser.save();
    }
    async getHospitalStaffStats(hospitalId) {
        const doctors = await this.userModel.countDocuments({
            hospitalId,
            role: { $in: ['DOCTOR', 'doctor'] }
        });
        const staff = await this.userModel.countDocuments({
            hospitalId,
            role: { $in: ['RECEPTIONIST', 'receptionist', 'THERAPIST', 'therapist'] }
        });
        return { doctors, staff };
    }
    async findAllByHospital(hospitalId) {
        return this.userModel.find({ hospitalId }).select('-password').exec();
    }
    async findAll(role, hospitalId) {
        const query = {};
        if (role !== 'SUPER_ADMIN') {
            query.hospitalId = hospitalId;
        }
        return this.userModel.find(query)
            .populate('hospitalId', 'name domain plan')
            .select('-password')
            .exec();
    }
    async findOne(id) {
        const user = await this.userModel.findById(id).select('-password').exec();
        if (!user)
            throw new common_1.NotFoundException(`User #${id} not found`);
        return user;
    }
    async findByEmail(email) {
        return this.userModel.findOne({ email }).exec();
    }
    async update(id, updateUserDto, adminUser) {
        if (updateUserDto.password) {
            const salt = await bcrypt.genSalt(10);
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
        }
        const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
        if (!updatedUser) {
            throw new common_1.NotFoundException(`User #${id} not found`);
        }
        if (adminUser) {
            try {
                const adminId = adminUser.id || adminUser._id || adminUser.userId || adminUser.sub;
                let details = `Updated profile for staff member: ${updatedUser.name}`;
                if (updateUserDto.attendanceStatus) {
                    details = `Changed attendance status of ${updatedUser.name} to ${updateUserDto.attendanceStatus}`;
                }
                if (adminId) {
                    await this.auditLogsService.create({
                        hospitalId: adminUser.hospitalId,
                        userId: adminId,
                        action: 'UPDATED_STAFF_RECORD',
                        module: 'STAFF_DIRECTORY',
                        details: details,
                        targetId: id
                    });
                }
                else {
                    this.logger.warn('Could not extract Admin ID from JWT to create Audit Log');
                }
            }
            catch (error) {
                this.logger.error(`Failed to log staff update action: ${error.message}`);
            }
        }
        return updatedUser;
    }
    async remove(id) {
        return this.userModel.findByIdAndDelete(id).exec();
    }
    async findPatientsByHospital(hospitalId) {
        return this.userModel.find({
            hospitalId,
            role: { $in: ['PATIENT', 'patient'] }
        }).select('-password').sort({ createdAt: -1 }).exec();
    }
    async findByRole(role, hospitalId) {
        return this.userModel.find({
            hospitalId: hospitalId,
            role: { $regex: new RegExp(`^${role}$`, 'i') }
        }).select('name _id').exec();
    }
    async findAdminByHospitalId(hospitalId) {
        return this.userModel.findOne({
            hospitalId,
            role: { $regex: new RegExp('^ADMIN$', 'i') },
        }).select('name email').exec();
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)('Hospital')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        audit_logs_service_1.AuditLogsService])
], UsersService);
//# sourceMappingURL=users.service.js.map