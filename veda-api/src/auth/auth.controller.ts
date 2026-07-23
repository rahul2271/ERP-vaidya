import { Controller, Request, Post, UseGuards, Body, UnauthorizedException, Logger, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport'; // ✅ For JWT validation
import { RolesGuard } from './roles.guard'; // ✅ For Role-based access
import { Roles } from './roles.decorator'; // ✅ Custom decorator
import { Role } from './roles.enum'; // ✅ Role enum (Admin, Doctor, etc.)
// 🚀 1. Import your new AuditLogsService
import { AuditLogsService } from '../audit-logs/audit-logs.service'; 

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private authService: AuthService,
    // 🚀 2. Inject the AuditLogsService
    private auditLogsService: AuditLogsService 
  ) {}

  // ✅ Public self-serve signup — creates a hospital + admin account and starts
  // a 15-day full-Premium trial. No auth guard: this is the entry point for new signups.
  @Post('signup')
  async signup(@Body() signupDto: any) {
    if (!signupDto.hospitalName || !signupDto.adminEmail || !signupDto.adminPassword) {
      throw new UnauthorizedException('Clinic name, admin email, and password are required.');
    }
    return this.authService.signup(signupDto);
  }

  @Post('login')
  async login(
    @Body('email') email: string, 
    @Body('password') password: string,
    // 🚀 3. Grab the request object to get the IP address
    @Request() req: any 
  ) {
    if (!email || !password) {
      this.logger.error('Missing email or password in request body');
      throw new UnauthorizedException('Email and password are required');
    }

    const normalizedEmail = email.toLowerCase().trim();
    this.logger.log(`Attempting login for: ${normalizedEmail}`);

    const user = await this.authService.validateUser(normalizedEmail, password);
    if (!user) {
      this.logger.warn(`Failed login attempt for: ${normalizedEmail}`);
      throw new UnauthorizedException('Invalid email or password');
    }

    this.logger.log(`Success! User ${normalizedEmail} logged in.`);

    // 🚀 4. Capture IP and save to Audit Log
    // Render uses reverse proxies, so we check 'x-forwarded-for' first
    const ipAddress = req.headers['x-forwarded-for'] || req.connection?.remoteAddress || 'Unknown IP';
    
    await this.auditLogsService.create({
      hospitalId: user.hospitalId, // 🚀 Keep logs tied to the clinic
      action: 'LOGIN',
      module: 'SECURITY', // 🚀 Triggers the purple badge on the frontend
      userId: user._id || user.id, 
      ipAddress: ipAddress,
      details: `User logged in from ${ipAddress}`
    });

    return this.authService.login(user);
  }

  // 🚀 5. New secure logout endpoint for the frontend to hit
  @Post('logout')
  @UseGuards(AuthGuard('jwt')) // Must be logged in to log out
  async logout(@Request() req: any) {
    // 🚀 Print exactly what the JWT strategy is passing us to your Render logs
    this.logger.log(`Logout request received. Token payload: ${JSON.stringify(req.user)}`);

    const ipAddress = req.headers['x-forwarded-for'] || req.connection?.remoteAddress || 'Unknown IP';
    
    // 🚀 Catch every possible ID variation safely
    const userId = req.user?.id || req.user?._id || req.user?.userId || req.user?.sub;

    if (!userId) {
      this.logger.error('Failed to log logout: Could not find User ID in token.');
      return { message: 'Logged out locally' };
    }

    await this.auditLogsService.create({
      hospitalId: req.user?.hospitalId, // 🚀 Keep logs tied to the clinic
      action: 'LOGOUT',
      module: 'SECURITY', // 🚀 Triggers the purple badge
      userId: userId,
      ipAddress: ipAddress,
      details: 'User intentionally ended their session.'
    });

    this.logger.log(`Successfully recorded logout for User ID: ${userId}`);
    return { message: 'Logged out successfully' };
  }

  // ✅ Secure Staff Registration Endpoint
  @Post('register-staff')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  async registerStaff(@Body() staffDto: any, @Request() req) {
    return this.authService.registerStaff(staffDto, req.user);
  }
}