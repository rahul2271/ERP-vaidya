"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../src/app.module");
const mongoose_1 = require("@nestjs/mongoose");
const hospital_schema_1 = require("../src/hospitals/schemas/hospital.schema");
const user_schema_1 = require("../src/users/schemas/user.schema");
const room_schema_1 = require("../src/rooms/schemas/room.schema");
const bcrypt = __importStar(require("bcrypt"));
async function bootstrap() {
    try {
        const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
        const hospitalModel = app.get((0, mongoose_1.getModelToken)(hospital_schema_1.Hospital.name));
        const userModel = app.get((0, mongoose_1.getModelToken)(user_schema_1.User.name));
        const roomModel = app.get((0, mongoose_1.getModelToken)(room_schema_1.Room.name));
        console.log('🧹 Clearing old data...');
        await hospitalModel.deleteMany({});
        await userModel.deleteMany({});
        await roomModel.deleteMany({});
        console.log('🛡️ Creating Veda System Tenant...');
        const systemTenant = await hospitalModel.create({
            name: 'VEDA ERP HEADQUARTERS',
            domain: 'system',
            city: 'Digital',
            state: 'Global',
            phone: '0000000000',
            plan: 'PREMIUM',
            status: 'Active'
        });
        console.log('🏥 Creating Yukti Herbs Hospital...');
        const yuktiHospital = await hospitalModel.create({
            name: 'Yukti Herbs Ayurveda',
            domain: 'yuktiherbs',
            city: 'Mohali',
            state: 'Punjab',
            phone: '9876543210',
            plan: 'PREMIUM',
            status: 'Active'
        });
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);
        console.log('👥 Distributing Staff Accounts...');
        await userModel.create([
            {
                hospitalId: systemTenant._id,
                name: 'Rahul Chauhan (Super)',
                email: 'admin@rctech.com',
                password: hashedPassword,
                role: 'SUPER_ADMIN',
                isActive: true
            },
            {
                hospitalId: yuktiHospital._id,
                name: 'Yukti Owner',
                email: 'admin@yukti.com',
                password: hashedPassword,
                role: 'ADMIN',
                isActive: true
            },
            {
                hospitalId: yuktiHospital._id,
                name: 'Dr. Ajay Sharma',
                email: 'dr.ajay@yukti.com',
                password: hashedPassword,
                role: 'DOCTOR',
                specialization: 'Ayurveda MD',
                isActive: true
            },
            {
                hospitalId: yuktiHospital._id,
                name: 'Sonia (Tele-Sales)',
                email: 'telecaller@yukti.com',
                password: hashedPassword,
                role: 'TELECALLER',
                isActive: true
            },
            {
                hospitalId: yuktiHospital._id,
                name: 'Main Pharmacy Desk',
                email: 'pharmacist@yukti.com',
                password: hashedPassword,
                role: 'PHARMACIST',
                isActive: true
            }
        ]);
        await roomModel.create([
            { hospitalId: yuktiHospital._id, name: 'Panchakarma Room 1', type: 'WET' },
            { hospitalId: yuktiHospital._id, name: 'Massage Room A', type: 'DRY' },
        ]);
        await app.close();
        console.log('--- SEEDING COMPLETE ---');
        console.log('✅ ERP OWNER: admin@rctech.com (Isolated from client hospitals)');
        console.log('✅ YUKTI ADMIN: admin@yukti.com');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Seeding Failed:', error);
        process.exit(1);
    }
}
bootstrap();
//# sourceMappingURL=seed.js.map