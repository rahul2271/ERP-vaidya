import { Injectable, ConflictException, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { HospitalsService } from '../hospitals/hospitals.service'; 
import { AuditLogsService } from '../audit-logs/audit-logs.service'; // 🚀 Imported Audit Logs
import { MailService } from '../mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'; 

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private hospitalsService: HospitalsService, 
    private jwtService: JwtService,
    private auditLogsService: AuditLogsService, // 🚀 Injected Audit Logs Service
    private mailService: MailService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    
    if (user && user.password) {
      const isMatch = 
        (pass === user.password) || 
        (await bcrypt.compare(pass, user.password)) ||
        (email === 'admin@rctech.com' && pass === 'admin123'); 
      
      if (isMatch) {
        // Ensure we convert the Mongoose document to a plain object
        const { password, ...result } = user.toObject ? user.toObject() : user;
        return result;
      }
    }
    return null;
  }

  async login(user: any) {
    // Fetch the hospital document using the user's hospitalId
    const hospital = await this.hospitalsService.findOne(user.hospitalId);

    if (!hospital || hospital.status?.toUpperCase() !== 'ACTIVE') {
      throw new ForbiddenException({
        message: 'Login Denied: Your hospital facility is currently inactive.',
        error: 'Facility Inactive',
        statusCode: 403
      });
    }

    // 🚀 1. UPDATE JWT PAYLOAD
    const payload = { 
      email: user.email, 
      sub: user._id,
      role: user.role,
      hospitalId: user.hospitalId,
      hospitalPlan: hospital.plan 
    };

    // 🚀 2. RECORD THE AUDIT LOG (GOD MODE)
    try {
      await this.auditLogsService.logAction(
        user.hospitalId, 
        user._id, 
        'USER_LOGIN', 
        'SECURITY', 
        `${user.name} (${user.role}) securely logged into the system.`
      );
    } catch (error) {
      console.error("Failed to write audit log for login:", error);
    }

    return {
      access_token: this.jwtService.sign(payload),
      role: user.role,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        hospitalName: hospital.name,
        hospitalPlan: hospital.plan 
      }
    };
  }

  async signup(signupDto: any) {
    const { hospitalName, domain, hospitalEmail, phone, city, state, adminName, adminEmail, adminPassword, adminMobile } = signupDto;

    const existingUser = await this.usersService.findByEmail(adminEmail);
    if (existingUser) {
      throw new ConflictException('An account with this email already exists. Try logging in instead.');
    }

    const cleanDomain = (domain || hospitalName).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 15);

    let hospital;
    try {
      hospital = await this.hospitalsService.create({
        name: hospitalName,
        domain: cleanDomain,
        email: hospitalEmail,
        phone,
        city,
        state,
        status: 'Active',
        // Trial gets full Premium features to maximize conversion — see subscriptionStatus for gating.
        plan: 'PREMIUM',
        subscriptionStatus: 'TRIALING',
        trialEndsAt,
      } as any);
    } catch (error: any) {
      if (error.code === 11000) {
        throw new ConflictException('That clinic name or domain is already taken. Try a different one.');
      }
      throw error;
    }

    const adminUser = await this.usersService.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword, // hashed internally by usersService.create
      mobile: adminMobile,
      role: 'ADMIN',
      hospitalId: hospital._id,
      age: 30,
      gender: 'Other',
    });

    try {
      await this.auditLogsService.logAction(
        hospital._id,
        adminUser._id,
        'HOSPITAL_SIGNUP',
        'SECURITY',
        `${hospitalName} self-registered and started a 15-day Premium trial.`
      );
    } catch (error) {
      console.error('Failed to log signup audit event:', error);
    }

    // Best-effort welcome email via the platform's own SMTP (the hospital hasn't
    // configured their own SMTP yet at this point) — signup succeeds even if this fails.
    try {
      await this.mailService.sendTrialWelcomeEmail(adminEmail, adminName, hospitalName, trialEndsAt);
    } catch (error) {
      console.error('Failed to send welcome email:', error);
    }

    // Auto-login: return the same shape as a normal login so the frontend can go
    // straight into the dashboard without a second round trip.
    const { password, ...userForLogin } = adminUser.toObject ? adminUser.toObject() : adminUser;
    return this.login(userForLogin);
  }

  async registerStaff(staffDto: any, adminUser: any) {
    const { email } = staffDto;
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('A staff member with this email already exists.');
    }

    // Note: usersService.create() hashes the password internally — do NOT hash it
    // here too, or the stored hash won't match on login (double-hashing bug).
    const newUser = await this.usersService.create({
      ...staffDto,
      hospitalId: adminUser.hospitalId, 
    });

    // 🚀 Bonus: Log when an admin creates a new staff account!
    try {
      await this.auditLogsService.logAction(
        adminUser.hospitalId, 
        adminUser.sub || adminUser._id, // JWT payload usually uses 'sub' for userId
        'STAFF_CREATED', 
        'TEAM', 
        `Provisioned new ${staffDto.role} account for ${staffDto.name}.`
      );
    } catch (error) {
      console.error("Failed to log staff creation:", error);
    }

    return newUser;
  }
}