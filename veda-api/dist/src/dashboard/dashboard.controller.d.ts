import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getAdminDashboard(req: any): Promise<{
        stats: {
            totalPatients: number;
            revenue: any;
            doctorsCount: number;
            staffCount: number;
        };
        recentAppointments: {
            id: any;
            patient: any;
            time: string;
            doctor: any;
            status: any;
        }[];
        onDutyStaff: {
            name: string;
            role: string;
            status: string;
        }[];
        beds: {
            occupied: number;
            total: any;
        };
    }>;
}
