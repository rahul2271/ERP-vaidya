// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { Hospital } from '../hospitals/schemas/hospital.schema';
// import { User } from '../users/schemas/user.schema';

// @Injectable()
// export class SuperAdminService {
//   constructor(
//     @InjectModel(Hospital.name) private hospitalModel: Model<Hospital>,
//     @InjectModel(User.name) private userModel: Model<User>,
//   ) {}

//   async getDashboardMetrics() {
//     // 1. Current Metrics
//     const totalHospitals = await this.hospitalModel.countDocuments();
//     const activeLicenses = await this.hospitalModel.countDocuments({ status: 'Active' });
//     const premiumHospitals = await this.hospitalModel.countDocuments({ plan: 'PREMIUM' });

//     // 2. Current MRR (Assuming ₹5000/month)
//     const monthlyRecurringRevenue = premiumHospitals * 5000;

//     // 3. System Usage
//     const totalUsers = await this.userModel.countDocuments();
//     const activeAdmins = await this.userModel.countDocuments({ role: 'ADMIN' });
//     const networkHealth = totalHospitals > 0 ? Math.round((activeLicenses / totalHospitals) * 100) : 100;

//     // 🚀 4. GENERATE LIVE HISTORICAL DATA FOR THE CHART
//     const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
//     // 🚀 FIX: Explicitly tell TypeScript the shape of the objects inside this array
//     const history: { name: string; revenue: number }[] = [];

//     // Loop backwards through the last 6 months
//     for (let i = 5; i >= 0; i--) {
//       const targetDate = new Date();
//       targetDate.setMonth(targetDate.getMonth() - i);
      
//       // Get the last day of that specific month
//       const endOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0);

//       // Find how many PREMIUM hospitals were created ON or BEFORE that month
//       const historicalPremiumCount = await this.hospitalModel.countDocuments({
//         plan: 'PREMIUM',
//         createdAt: { $lte: endOfMonth } // Requires 'timestamps: true' in your schema
//       });

//       history.push({
//         name: monthNames[targetDate.getMonth()],
//         revenue: historicalPremiumCount * 5000
//       });
//     }

//     return {
//       metrics: {
//         totalHospitals,
//         activeLicenses,
//         premiumHospitals,
//         networkHealth,
//         totalUsers,
//         activeAdmins,
//       },
//       revenue: {
//         mrr: monthlyRecurringRevenue,
//         currency: 'INR',
//         history: history // 🚀 Send the dynamic history to React
//       }
//     };
//   }
// }

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Hospital } from '../hospitals/schemas/hospital.schema';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class SuperAdminService {
  constructor(
    @InjectModel(Hospital.name) private hospitalModel: Model<Hospital>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  // 🚀 1. The missing method that was causing your error
  async getDashboardMetrics() {
    const totalHospitals = await this.hospitalModel.countDocuments();
    const activeLicenses = await this.hospitalModel.countDocuments({ status: 'Active' });
    const premiumHospitals = await this.hospitalModel.countDocuments({ plan: 'PREMIUM' });

    const monthlyRecurringRevenue = premiumHospitals * 5000;
    const totalUsers = await this.userModel.countDocuments();
    const activeAdmins = await this.userModel.countDocuments({ role: 'ADMIN' });
    const networkHealth = totalHospitals > 0 ? Math.round((activeLicenses / totalHospitals) * 100) : 100;

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const history: { name: string; revenue: number }[] = [];

    for (let i = 5; i >= 0; i--) {
      const targetDate = new Date();
      targetDate.setMonth(targetDate.getMonth() - i);
      const endOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0);

      const historicalPremiumCount = await this.hospitalModel.countDocuments({
        plan: 'PREMIUM',
        createdAt: { $lte: endOfMonth }
      });

      history.push({
        name: monthNames[targetDate.getMonth()],
        revenue: historicalPremiumCount * 5000
      });
    }

    return {
      metrics: { totalHospitals, activeLicenses, premiumHospitals, networkHealth, totalUsers, activeAdmins },
      revenue: { mrr: monthlyRecurringRevenue, currency: 'INR', history }
    };
  }

  // 🚀 2. The new plan toggle logic
  async toggleHospitalPlan(hospitalId: string, plan: 'BASIC' | 'PREMIUM') {
    const hospital = await this.hospitalModel.findByIdAndUpdate(
      hospitalId,
      { plan },
      { new: true }
    );

    if (!hospital) throw new NotFoundException('Hospital facility not found');

    const premiumFlag = plan === 'PREMIUM';
    await this.userModel.updateMany(
      { hospitalId: hospital._id },
      { $set: { isPremium: premiumFlag } }
    );

    return {
      message: `Facility upgraded to ${plan}. All accounts synced.`,
      plan: hospital.plan
    };
  }
}