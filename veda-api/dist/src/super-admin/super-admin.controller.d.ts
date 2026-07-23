import { SuperAdminService } from './super-admin.service';
export declare class SuperAdminController {
    private readonly superAdminService;
    constructor(superAdminService: SuperAdminService);
    getMetrics(req: any): Promise<{
        metrics: {
            totalHospitals: number;
            activeLicenses: number;
            premiumHospitals: number;
            networkHealth: number;
            totalUsers: number;
            activeAdmins: number;
        };
        revenue: {
            mrr: number;
            currency: string;
            history: {
                name: string;
                revenue: number;
            }[];
        };
    }>;
}
