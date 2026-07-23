import { Model } from 'mongoose';
import { Hospital } from '../hospitals/schemas/hospital.schema';
import { User } from '../users/schemas/user.schema';
export declare class SuperAdminService {
    private hospitalModel;
    private userModel;
    constructor(hospitalModel: Model<Hospital>, userModel: Model<User>);
    getDashboardMetrics(): Promise<{
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
    toggleHospitalPlan(hospitalId: string, plan: 'BASIC' | 'PREMIUM'): Promise<{
        message: string;
        plan: string;
    }>;
}
