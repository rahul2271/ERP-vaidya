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
const app_module_1 = require("./app.module");
const mongoose_1 = require("@nestjs/mongoose");
const hospital_schema_1 = require("./hospitals/schemas/hospital.schema");
const user_schema_1 = require("./users/schemas/user.schema");
const room_schema_1 = require("./rooms/schemas/room.schema");
const bcrypt = __importStar(require("bcrypt"));
var Role;
(function (Role) {
    Role["SUPER_ADMIN"] = "super_admin";
    Role["ADMIN"] = "admin";
    Role["DOCTOR"] = "doctor";
    Role["THERAPIST"] = "therapist";
    Role["RECEPTIONIST"] = "receptionist";
    Role["PATIENT"] = "patient";
})(Role || (Role = {}));
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
        console.log('🏥 Creating Yukti Herbs Hospital...');
        const hospital = await hospitalModel.create({
            name: 'Yukti Herbs Ayurveda',
            domain: 'yuktiherbs',
            city: 'Mohali',
            state: 'Punjab',
            phone: '9876543210',
            plan: 'PREMIUM'
        });
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);
        console.log('👥 Creating Staff Accounts...');
        await userModel.create([
            {
                hospitalId: hospital._id,
                name: 'Rahul Chauhan (Super)',
                email: 'admin@rctech.com',
                password: hashedPassword,
                role: Role.SUPER_ADMIN,
                isActive: true
            },
            {
                hospitalId: hospital._id,
                name: 'Yukti Owner',
                email: 'admin@yukti.com',
                password: hashedPassword,
                role: Role.ADMIN,
                isActive: true
            },
            {
                hospitalId: hospital._id,
                name: 'Dr. Ajay Sharma',
                email: 'dr.ajay@yukti.com',
                password: hashedPassword,
                role: Role.DOCTOR,
                specialization: 'Ayurveda MD',
                isActive: true
            },
            {
                hospitalId: hospital._id,
                name: 'Priya (Front Desk)',
                email: 'reception@yukti.com',
                password: hashedPassword,
                role: Role.RECEPTIONIST,
                isActive: true
            },
            {
                hospitalId: hospital._id,
                name: 'Ravi Therapist',
                email: 'ravi@yukti.com',
                password: hashedPassword,
                role: Role.THERAPIST,
                specialization: 'Panchakarma',
                isActive: true
            }
        ]);
        await roomModel.create([
            { hospitalId: hospital._id, name: 'Panchakarma Room 1', type: 'WET' },
            { hospitalId: hospital._id, name: 'Massage Room A', type: 'DRY' },
        ]);
        await app.close();
        console.log('✅ Seeding Complete. Use "admin123" to login.');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Seeding Failed:', error);
        process.exit(1);
    }
}
bootstrap();
//# sourceMappingURL=seed.js.map