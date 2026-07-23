import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Hospital } from './hospitals/schemas/hospital.schema';
import { User } from './users/schemas/user.schema';
import { Room } from './rooms/schemas/room.schema';
import * as bcrypt from 'bcrypt';

// ✅ Define Role Enum locally to ensure matches
enum Role {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  DOCTOR = 'doctor',
  THERAPIST = 'therapist',
  RECEPTIONIST = 'receptionist',
  PATIENT = 'patient',
}

async function bootstrap() {
  try {
    const app = await NestFactory.createApplicationContext(AppModule);

    const hospitalModel = app.get<Model<Hospital>>(getModelToken(Hospital.name));
    const userModel = app.get<Model<User>>(getModelToken(User.name));
    const roomModel = app.get<Model<Room>>(getModelToken(Room.name));

    // 1. CLEAR DATA
    console.log('🧹 Clearing old data...');
    await hospitalModel.deleteMany({});
    await userModel.deleteMany({});
    await roomModel.deleteMany({});

    // 2. CREATE HOSPITAL
    console.log('🏥 Creating Yukti Herbs Hospital...');
    const hospital = await hospitalModel.create({
      name: 'Yukti Herbs Ayurveda',
      domain: 'yuktiherbs',
      city: 'Mohali',
      state: 'Punjab',
      phone: '9876543210',
      plan: 'PREMIUM'
    });

    // 3. GENERATE PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // 4. CREATE USERS (Using Correct Enum Values)
    console.log('👥 Creating Staff Accounts...');
    
    await userModel.create([
      // 1. SUPER ADMIN
      {
        hospitalId: hospital._id,
        name: 'Rahul Chauhan (Super)',
        email: 'admin@rctech.com',
        password: hashedPassword,
        role: Role.SUPER_ADMIN, // 'super_admin'
        isActive: true
      },
      // 2. HOSPITAL ADMIN
      {
        hospitalId: hospital._id,
        name: 'Yukti Owner',
        email: 'admin@yukti.com',
        password: hashedPassword,
        role: Role.ADMIN, // 'admin'
        isActive: true
      },
      // 3. DOCTOR
      {
        hospitalId: hospital._id,
        name: 'Dr. Ajay Sharma',
        email: 'dr.ajay@yukti.com',
        password: hashedPassword,
        role: Role.DOCTOR, // 'doctor'
        specialization: 'Ayurveda MD',
        isActive: true
      },
      // 4. RECEPTIONIST
      {
        hospitalId: hospital._id,
        name: 'Priya (Front Desk)',
        email: 'reception@yukti.com',
        password: hashedPassword,
        role: Role.RECEPTIONIST, // 'receptionist'
        isActive: true
      },
      // 5. THERAPIST
      {
        hospitalId: hospital._id,
        name: 'Ravi Therapist',
        email: 'ravi@yukti.com',
        password: hashedPassword,
        role: Role.THERAPIST, // 'therapist'
        specialization: 'Panchakarma',
        isActive: true
      }
    ]);

    // 5. CREATE ROOMS
    await roomModel.create([
      { hospitalId: hospital._id, name: 'Panchakarma Room 1', type: 'WET' },
      { hospitalId: hospital._id, name: 'Massage Room A', type: 'DRY' },
    ]);

    await app.close();
    console.log('✅ Seeding Complete. Use "admin123" to login.');
    process.exit(0);

  } catch (error) {
    console.error('❌ Seeding Failed:', error);
    process.exit(1);
  }
}

bootstrap();