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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperAdminService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const hospital_schema_1 = require("../hospitals/schemas/hospital.schema");
const user_schema_1 = require("../users/schemas/user.schema");
let SuperAdminService = class SuperAdminService {
    hospitalModel;
    userModel;
    constructor(hospitalModel, userModel) {
        this.hospitalModel = hospitalModel;
        this.userModel = userModel;
    }
    async getDashboardMetrics() {
        const totalHospitals = await this.hospitalModel.countDocuments();
        const activeLicenses = await this.hospitalModel.countDocuments({ status: 'Active' });
        const premiumHospitals = await this.hospitalModel.countDocuments({ plan: 'PREMIUM' });
        const monthlyRecurringRevenue = premiumHospitals * 5000;
        const totalUsers = await this.userModel.countDocuments();
        const activeAdmins = await this.userModel.countDocuments({ role: 'ADMIN' });
        const networkHealth = totalHospitals > 0 ? Math.round((activeLicenses / totalHospitals) * 100) : 100;
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const history = [];
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
    async toggleHospitalPlan(hospitalId, plan) {
        const hospital = await this.hospitalModel.findByIdAndUpdate(hospitalId, { plan }, { new: true });
        if (!hospital)
            throw new common_1.NotFoundException('Hospital facility not found');
        const premiumFlag = plan === 'PREMIUM';
        await this.userModel.updateMany({ hospitalId: hospital._id }, { $set: { isPremium: premiumFlag } });
        return {
            message: `Facility upgraded to ${plan}. All accounts synced.`,
            plan: hospital.plan
        };
    }
};
exports.SuperAdminService = SuperAdminService;
exports.SuperAdminService = SuperAdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(hospital_schema_1.Hospital.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], SuperAdminService);
//# sourceMappingURL=super-admin.service.js.map