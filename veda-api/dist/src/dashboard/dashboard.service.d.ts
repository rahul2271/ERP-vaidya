import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import { Patient } from '../patients/schemas/patient.schema';
import { Appointment } from '../appointments/schemas/appointment.schema';
import { Room } from '../rooms/schemas/room.schema';
export declare class DashboardService {
    private userModel;
    private patientModel;
    private appointmentModel;
    private roomModel;
    constructor(userModel: Model<User>, patientModel: Model<Patient>, appointmentModel: Model<Appointment>, roomModel: Model<Room>);
    getAdminDashboard(hospitalId: string): Promise<{
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
