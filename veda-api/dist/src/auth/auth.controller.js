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
var AuthController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("./roles.guard");
const roles_decorator_1 = require("./roles.decorator");
const roles_enum_1 = require("./roles.enum");
const audit_logs_service_1 = require("../audit-logs/audit-logs.service");
let AuthController = AuthController_1 = class AuthController {
    authService;
    auditLogsService;
    logger = new common_1.Logger(AuthController_1.name);
    constructor(authService, auditLogsService) {
        this.authService = authService;
        this.auditLogsService = auditLogsService;
    }
    async signup(signupDto) {
        if (!signupDto.hospitalName || !signupDto.adminEmail || !signupDto.adminPassword) {
            throw new common_1.UnauthorizedException('Clinic name, admin email, and password are required.');
        }
        return this.authService.signup(signupDto);
    }
    async login(email, password, req) {
        if (!email || !password) {
            this.logger.error('Missing email or password in request body');
            throw new common_1.UnauthorizedException('Email and password are required');
        }
        const normalizedEmail = email.toLowerCase().trim();
        this.logger.log(`Attempting login for: ${normalizedEmail}`);
        const user = await this.authService.validateUser(normalizedEmail, password);
        if (!user) {
            this.logger.warn(`Failed login attempt for: ${normalizedEmail}`);
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        this.logger.log(`Success! User ${normalizedEmail} logged in.`);
        const ipAddress = req.headers['x-forwarded-for'] || req.connection?.remoteAddress || 'Unknown IP';
        await this.auditLogsService.create({
            hospitalId: user.hospitalId,
            action: 'LOGIN',
            module: 'SECURITY',
            userId: user._id || user.id,
            ipAddress: ipAddress,
            details: `User logged in from ${ipAddress}`
        });
        return this.authService.login(user);
    }
    async logout(req) {
        this.logger.log(`Logout request received. Token payload: ${JSON.stringify(req.user)}`);
        const ipAddress = req.headers['x-forwarded-for'] || req.connection?.remoteAddress || 'Unknown IP';
        const userId = req.user?.id || req.user?._id || req.user?.userId || req.user?.sub;
        if (!userId) {
            this.logger.error('Failed to log logout: Could not find User ID in token.');
            return { message: 'Logged out locally' };
        }
        await this.auditLogsService.create({
            hospitalId: req.user?.hospitalId,
            action: 'LOGOUT',
            module: 'SECURITY',
            userId: userId,
            ipAddress: ipAddress,
            details: 'User intentionally ended their session.'
        });
        this.logger.log(`Successfully recorded logout for User ID: ${userId}`);
        return { message: 'Logged out successfully' };
    }
    async registerStaff(staffDto, req) {
        return this.authService.registerStaff(staffDto, req.user);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('signup'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signup", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)('email')),
    __param(1, (0, common_1.Body)('password')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('register-staff'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN, roles_enum_1.Role.SUPER_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "registerStaff", null);
exports.AuthController = AuthController = AuthController_1 = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        audit_logs_service_1.AuditLogsService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map