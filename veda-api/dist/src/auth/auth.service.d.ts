import { UsersService } from '../users/users.service';
import { HospitalsService } from '../hospitals/hospitals.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { MailService } from '../mail/mail.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private usersService;
    private hospitalsService;
    private jwtService;
    private auditLogsService;
    private mailService;
    constructor(usersService: UsersService, hospitalsService: HospitalsService, jwtService: JwtService, auditLogsService: AuditLogsService, mailService: MailService);
    validateUser(email: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
        role: any;
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
            hospitalName: string;
            hospitalPlan: string;
        };
    }>;
    signup(signupDto: any): Promise<{
        access_token: string;
        role: any;
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
            hospitalName: string;
            hospitalPlan: string;
        };
    }>;
    registerStaff(staffDto: any, adminUser: any): Promise<import("mongoose").Document<unknown, {}, import("../users/schemas/user.schema").UserDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../users/schemas/user.schema").User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}
