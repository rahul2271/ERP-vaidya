import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt'; 
// 🚀 1. Import AuditLogsService
import { AuditLogsService } from '../audit-logs/audit-logs.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel('Hospital') private hospitalModel: Model<any>, // 🚀 Added to verify hospital limits
    // 🚀 2. Inject it here
    private auditLogsService: AuditLogsService
  ) {}

  // 🚀 CREATE USER (With Subscription Gate & Hashing)
  async create(createUserDto: any) { 
    const hospitalId = createUserDto.hospitalId;

    // --- SAAS LIMITS ENFORCEMENT ---
    if (hospitalId) {
      const hospital = await this.hospitalModel.findById(hospitalId);
      
      // We only want to limit STAFF, not patients (patients usually have their own logic, but just in case)
      const isStaff = !['PATIENT', 'patient'].includes(createUserDto.role);

      if (hospital && isStaff && hospital.plan === 'BASIC') {
        const currentStaffCount = await this.userModel.countDocuments({ 
          hospitalId, 
          role: { $nin: ['PATIENT', 'patient'] } // Count only staff members
        });

        // 1. Block creation if they hit the 3-staff limit (Note: updated to 6 in your code)
        if (currentStaffCount >= 6) {
          throw new ForbiddenException('BASIC_LIMIT_REACHED: Basic plan allows a maximum of 6 staff members.');
        }

        // 2. Force default permissions (Basic plan users cannot hide financials)
        createUserDto.permissions = {
          canViewFinancials: true, 
          canEditInventory: true,
          canExportData: false
        };
      }
    }
    // --- END SAAS LIMITS ---

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    return createdUser.save();
  }

  // Dashboard Stats
  async getHospitalStaffStats(hospitalId: string) {
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

  // Find Helpers
  async findAllByHospital(hospitalId: string) {
    return this.userModel.find({ hospitalId }).select('-password').exec();
  }

  async findAll(role: string, hospitalId: string) {
    const query: any = {};

    // 🚀 STRICT DATABASE ISOLATION
    // If the requester is not a Super Admin, lock the database query to their hospital ONLY.
    if (role !== 'SUPER_ADMIN') {
      query.hospitalId = hospitalId;
    }

    return this.userModel.find(query)
      .populate('hospitalId', 'name domain plan') 
      .select('-password') 
      .exec();
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id).select('-password').exec();
    if (!user) throw new NotFoundException(`User #${id} not found`);
    return user;
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec(); 
  }

  // 🚀 FIX: Enhanced Update method to accept the admin user and track logs
  // 🚀 FIX: Catching all possible JWT ID structures
  async update(id: string, updateUserDto: any, adminUser?: any) {
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt(10);
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }
    
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id, 
      updateUserDto, 
      { new: true } 
    ).exec();

    if (!updatedUser) {
      throw new NotFoundException(`User #${id} not found`);
    }

    // 🚀 NEW: Log the change to the Audit Log!
    if (adminUser) {
      try {
        // 🔥 Catch every possible way NestJS might store the user ID
        const adminId = adminUser.id || adminUser._id || adminUser.userId || adminUser.sub;
        
        let details = `Updated profile for staff member: ${updatedUser.name}`;
        if (updateUserDto.attendanceStatus) {
          details = `Changed attendance status of ${updatedUser.name} to ${updateUserDto.attendanceStatus}`;
        }

        // Only log if we successfully extracted the adminId
        if (adminId) {
          await this.auditLogsService.create({
            hospitalId: adminUser.hospitalId,
            userId: adminId, 
            action: 'UPDATED_STAFF_RECORD',
            module: 'STAFF_DIRECTORY',
            details: details,
            targetId: id
          });
        } else {
          this.logger.warn('Could not extract Admin ID from JWT to create Audit Log');
        }
      } catch (error) {
        this.logger.error(`Failed to log staff update action: ${error.message}`);
      }
    }

    return updatedUser;
  }

  async remove(id: string) {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async findPatientsByHospital(hospitalId: string) {
    return this.userModel.find({ 
      hospitalId, 
      role: { $in: ['PATIENT', 'patient'] } 
    }).select('-password').sort({ createdAt: -1 }).exec();
  }

  // ✅ FIX: Added case-insensitivity check to ensure Doctors are found
  async findByRole(role: string, hospitalId: string) {
    return this.userModel.find({ 
      hospitalId: hospitalId,
      role: { $regex: new RegExp(`^${role}$`, 'i') } // Matches 'DOCTOR' or 'doctor'
    }).select('name _id').exec();
  }

  // Used for billing/subscription emails, which need the admin's real email —
  // unlike findByRole above, which intentionally omits it for staff-list views.
  async findAdminByHospitalId(hospitalId: string) {
    return this.userModel.findOne({
      hospitalId,
      role: { $regex: new RegExp('^ADMIN$', 'i') },
    }).select('name email').exec();
  }
}



// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { User, UserDocument } from './schemas/user.schema';
// import * as bcrypt from 'bcrypt'; 

// @Injectable()
// export class UsersService {
//   constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

//   // Create User (Hashing Password)
//   async create(createUserDto: any) { 
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

//     const createdUser = new this.userModel({
//       ...createUserDto,
//       password: hashedPassword,
//     });
//     return createdUser.save();
//   }

//   // Dashboard Stats
//   async getHospitalStaffStats(hospitalId: string) {
//     const doctors = await this.userModel.countDocuments({ 
//       hospitalId, 
//       role: { $in: ['DOCTOR', 'doctor'] } 
//     });

//     // 🚀 THE FIX: Added PHARMACIST to the staff count
//     const staff = await this.userModel.countDocuments({ 
//       hospitalId, 
//       role: { $in: [
//         'RECEPTIONIST', 'receptionist', 
//         'THERAPIST', 'therapist', 
//         'PHARMACIST', 'pharmacist' // ✅ Added Pharmacist here
//       ] } 
//     });
//     return { doctors, staff };
//   }

//   // Find Helpers
//   async findAllByHospital(hospitalId: string) {
//     return this.userModel.find({ hospitalId }).select('-password').exec();
//   }

//   async findAll() {
//     return this.userModel.find().select('-password').exec();
//   }

//   async findOne(id: string) {
//     const user = await this.userModel.findById(id).select('-password').exec();
//     if (!user) throw new NotFoundException(`User #${id} not found`);
//     return user;
//   }

//   // async findByEmail(email: string) {
//   //   return this.userModel.findOne({ email }).exec(); 
//   // }
//   async findByEmail(email: string) {
//     // 🚀 THE FIX: Force Mongoose to return the password so auth.service can check it
//     return this.userModel.findOne({ email }).select('+password').exec(); 
//   }

//   async update(id: string, updateUserDto: any) {
//     if (updateUserDto.password) {
//       const salt = await bcrypt.genSalt(10);
//       updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
//     }
//     return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
//   }

//   async remove(id: string) {
//     return this.userModel.findByIdAndDelete(id).exec();
//   }

//   async findPatientsByHospital(hospitalId: string) {
//     return this.userModel.find({ 
//       hospitalId, 
//       role: { $in: ['PATIENT', 'patient'] } 
//     }).select('-password').sort({ createdAt: -1 }).exec();
//   }

//   // Case-insensitivity check to ensure roles are found correctly
//   async findByRole(role: string, hospitalId: string) {
//     return this.userModel.find({ 
//       hospitalId: hospitalId,
//       role: { $regex: new RegExp(`^${role}$`, 'i') } 
//     }).select('name _id').exec();
//   }

  
// }
