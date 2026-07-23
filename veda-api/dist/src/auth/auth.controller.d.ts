import { AuthService } from './auth.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
export declare class AuthController {
    private authService;
    private auditLogsService;
    private readonly logger;
    constructor(authService: AuthService, auditLogsService: AuditLogsService);
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
    login(email: string, password: string, req: any): Promise<{
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
    logout(req: any): Promise<{
        message: string;
    }>;
    registerStaff(staffDto: any, req: any): Promise<import("mongoose").Document<unknown, {}, import("../users/schemas/user.schema").UserDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../users/schemas/user.schema").User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}
