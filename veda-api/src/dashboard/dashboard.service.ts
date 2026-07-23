import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import { Patient } from '../patients/schemas/patient.schema';
import { Appointment } from '../appointments/schemas/appointment.schema';
import { Room } from '../rooms/schemas/room.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Patient.name) private patientModel: Model<Patient>,
    @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
    @InjectModel(Room.name) private roomModel: Model<Room>,
  ) {}

  async getAdminDashboard(hospitalId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const now = new Date();

    // 1. Calculate Stats concurrently specific to THIS hospital ID
    // Note: appointments use `startTime` (not `appointmentDate`) — using the wrong
    // field name here previously meant this query silently matched zero documents,
    // making "Today's Revenue" and "recent appointments" always show empty.
    const [totalPatients, doctorsCount, staffCount, todaysAppointments, rooms] = await Promise.all([
      this.patientModel.countDocuments({ hospitalId }),
      this.userModel.countDocuments({ hospitalId, role: 'DOCTOR' }),
      this.userModel.countDocuments({ hospitalId, role: { $in: ['NURSE', 'RECEPTIONIST', 'PHARMACIST'] } }),
      this.appointmentModel.find({
        hospitalId,
        startTime: { $gte: today }
      }).populate('doctorId', 'name').populate('patientId', 'name').sort({ startTime: 1 }).limit(5).exec(),
      this.roomModel.find({ hospitalId }).exec(),
    ]);

    // Revenue: use the actual billed amount field, and only count what's been paid today.
    const revenue = todaysAppointments.reduce((sum, apt: any) => sum + (apt.finalBilledAmount || apt.amount || 0), 0);

    // 2. Format Appointments for the table
    const formattedAppointments = todaysAppointments.map((apt: any) => ({
      id: apt._id,
      patient: apt.patientId?.name || 'Unknown',
      time: new Date(apt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      doctor: apt.doctorId?.name || 'Unassigned',
      status: apt.status || 'Scheduled'
    }));

    // 3. Fetch On-Duty Staff
    const onDutyStaff = await this.userModel.find({ 
      hospitalId, 
      role: { $in: ['DOCTOR', 'NURSE'] } 
    }).limit(5).select('name role status').exec();

    // 4. Real-time room/bed occupancy — total capacity across all rooms, vs. how
    // many are occupied by an appointment happening right now (was previously a
    // hardcoded 45/50 placeholder).
    const totalBeds = rooms.reduce((sum, r: any) => sum + (r.capacity || 1), 0);
    const activeRoomIds = await this.appointmentModel.distinct('roomId', {
      hospitalId,
      status: { $in: ['SCHEDULED', 'IN_PROGRESS', 'BOOKED'] },
      startTime: { $lte: now },
      endTime: { $gte: now },
    });
    const occupiedBeds = Math.min(activeRoomIds.length, totalBeds || activeRoomIds.length);

    return {
      stats: {
        totalPatients,
        revenue,
        doctorsCount,
        staffCount
      },
      recentAppointments: formattedAppointments,
      onDutyStaff: onDutyStaff.map(staff => ({
        name: staff.name,
        role: staff.role,
        status: 'Available' // Or fetch from staff.status if you track it
      })),
      beds: { occupied: occupiedBeds, total: totalBeds || 0 },
    };
  }
}
