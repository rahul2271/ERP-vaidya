// // // // scripts/seed.ts
// // // // Run using: npx ts-node scripts/seed.ts
// // // import { NestFactory } from '@nestjs/core';
// // // import { AppModule } from '../src/app.module';
// // // import { getModelToken } from '@nestjs/mongoose';
// // // import { Model } from 'mongoose';
// // // import { Hospital } from '../src/hospitals/schemas/hospital.schema';
// // // import { User } from '../src/users/schemas/user.schema';
// // // import { Room } from '../src/rooms/schemas/room.schema';

// // // async function bootstrap() {
// // //   const app = await NestFactory.createApplicationContext(AppModule);
  
// // // //   const hospitalModel = app.get<Model<Hospital>>(getModelToken(Hospital.name));
// // // //   const userModel = app.get<Model<User>>(getModelToken(User.name));
// // // //   const roomModel = app.get<Model<Room>>(getModelToken(Room.name));

// // // const hospitalModel = app.get<Model<Hospital>>(getModelToken(Hospital.name), { strict: false });
// // //   const userModel = app.get<Model<User>>(getModelToken(User.name), { strict: false });
// // //   const roomModel = app.get<Model<Room>>(getModelToken(Room.name), { strict: false });

// // //   // 1. Clear Data
// // //   await hospitalModel.deleteMany({});
// // //   await userModel.deleteMany({});
// // //   await roomModel.deleteMany({});

// // //   // 2. Create Hospital
// // //   const hospital = await hospitalModel.create({
// // //     name: 'RC Tech Ayurveda',
// // //     domain: 'rctech',
// // //     plan: 'PREMIUM',
// // //     config: { startTime: '09:00', endTime: '18:00' },
// // //   });
// // //   console.log(`Hospital Created: ${hospital.name}`);

// // //   // 3. Create Staff
// // //   await userModel.create([
// // //     {
// // //       hospitalId: hospital._id,
// // //       name: 'Dr. Rahul Chauhan',
// // //       email: 'admin@rctech.com',
// // //       passwordHash: 'hashedpassword123',
// // //       role: 'HOSPITAL_ADMIN',
// // //     },
// // //     {
// // //       hospitalId: hospital._id,
// // //       name: 'Therapist Ravi',
// // //       email: 'ravi@rctech.com',
// // //       passwordHash: 'hashedpassword123',
// // //       role: 'THERAPIST',
// // //       specialization: 'Panchakarma',
// // //     },
// // //   ]);
// // //   console.log('Staff Created');

// // //   // 4. Create Rooms
// // //   await roomModel.create([
// // //     {
// // //       hospitalId: hospital._id,
// // //       name: 'Room 101 (Wet Therapy)',
// // //       type: 'WET',
// // //       equipment: ['Steam Box', 'Droni Table'],
// // //     },
// // //     {
// // //       hospitalId: hospital._id,
// // //       name: 'Room 102 (Massage)',
// // //       type: 'DRY',
// // //       equipment: ['Massage Table'],
// // //     },
// // //   ]);
// // //   console.log('Rooms Created');

// // //   await app.close();
// // // }
// // // bootstrap();


// // // scripts/seed.ts
// // import { NestFactory } from '@nestjs/core';
// // import { AppModule } from '../src/app.module';
// // import { getModelToken } from '@nestjs/mongoose';
// // import { Model } from 'mongoose';
// // import { Hospital } from '../src/hospitals/schemas/hospital.schema';
// // import { User } from '../src/users/schemas/user.schema';
// // import { Room } from '../src/rooms/schemas/room.schema';

// // async function bootstrap() {
// //   try {
// //     const app = await NestFactory.createApplicationContext(AppModule);

// //     // { strict: false } allows the script to find Models even if they are hidden inside Modules
// //     const hospitalModel = app.get<Model<Hospital>>(getModelToken(Hospital.name), { strict: false });
// //     const userModel = app.get<Model<User>>(getModelToken(User.name), { strict: false });
// //     const roomModel = app.get<Model<Room>>(getModelToken(Room.name), { strict: false });

// //     // 1. Clear Data (Start Fresh)
// //     console.log('Clearing old data...');
// //     await hospitalModel.deleteMany({});
// //     await userModel.deleteMany({});
// //     await roomModel.deleteMany({});

// //     // 2. Create Hospital
// //     const hospital = await hospitalModel.create({
// //       name: 'RC Tech Ayurveda',
// //       domain: 'rctech',
// //       plan: 'PREMIUM',
// //       config: { startTime: '09:00', endTime: '18:00' },
// //     });
// //     console.log(`✅ Hospital Created: ${hospital.name}`);

// //     // 3. Create Staff
// //     await userModel.create([
// //       {
// //         hospitalId: hospital._id,
// //         name: 'Dr. Rahul Chauhan',
// //         email: 'admin@rctech.com',
// //         passwordHash: 'hashedpassword123', // In real app, use bcrypt
// //         role: 'HOSPITAL_ADMIN',
// //       },
// //       {
// //         hospitalId: hospital._id,
// //         name: 'Therapist Ravi',
// //         email: 'ravi@rctech.com',
// //         passwordHash: 'hashedpassword123',
// //         role: 'THERAPIST',
// //         specialization: 'Panchakarma',
// //       },
// //     ]);
// //     console.log('✅ Staff Created');

// //     // 4. Create Rooms
// //     await roomModel.create([
// //       {
// //         hospitalId: hospital._id,
// //         name: 'Room 101 (Wet Therapy)',
// //         type: 'WET',
// //         equipment: ['Steam Box', 'Droni Table'],
// //       },
// //       {
// //         hospitalId: hospital._id,
// //         name: 'Room 102 (Massage)',
// //         type: 'DRY',
// //         equipment: ['Massage Table'],
// //       },
// //     ]);
// //     console.log('✅ Rooms Created');

// //     await app.close();
// //     process.exit(0);

// //   } catch (error) {
// //     console.error('❌ Error Seeding Data:', error);
// //     process.exit(1);
// //   }
// // }

// // bootstrap();


// import { NestFactory } from '@nestjs/core';
// import { AppModule } from '../src/app.module';
// import { getModelToken } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { Hospital } from '../src/hospitals/schemas/hospital.schema';
// import { User } from '../src/users/schemas/user.schema';
// import { Room } from '../src/rooms/schemas/room.schema';
// import { Role } from '../src/auth/roles.enum';

// async function bootstrap() {
//   try {
//     const app = await NestFactory.createApplicationContext(AppModule);

//     // ✅ Get direct access to the Mongoose Models
//     const hospitalModel = app.get<Model<Hospital>>(getModelToken(Hospital.name));
//     const userModel = app.get<Model<User>>(getModelToken(User.name));
//     // Note: If you haven't created RoomSchema yet, comment these Room lines out
//     const roomModel = app.get<Model<Room>>(getModelToken(Room.name));

//     // 1. Clear Data (Clean Slate)
//     console.log('🧹 Clearing old data...');
//     await hospitalModel.deleteMany({});
//     await userModel.deleteMany({});
//     await roomModel.deleteMany({});

//     // 2. Create Hospital
//     console.log('🏥 Creating Hospital...');
//     const hospital = await hospitalModel.create({
//       name: 'RC Tech Ayurveda',
//       domain: 'rctech', 
//       city: 'Mohali',   
//       state: 'Punjab',
//       phone: '9876543210',
//       plan: 'PREMIUM'
//     });
    
//     if (!hospital) throw new Error('Hospital creation failed');
//     console.log(`✅ Hospital Created: ${hospital.name} (ID: ${hospital._id})`);

//     // 3. Create Staff (Linked to the Hospital created above)
//     // 3. Create Staff
//     console.log('👨‍⚕️ Creating Staff...');
//     await userModel.create([
//       {
//         hospitalId: hospital._id,
//         name: 'Dr. Rahul Chauhan',
//         email: 'admin@rctech.com',
//         password: 'hashedpassword123', 
//         role: 'super_admin', // ✅ HARDCODED STRING matches Enum
//         isActive: true
//       },
//       {
//         hospitalId: hospital._id,
//         name: 'Dr. Sharma',
//         email: 'doctor@rctech.com',
//         password: 'hashedpassword123',
//         role: 'doctor',      // ✅ HARDCODED STRING matches Enum
//         specialization: 'Ayurveda MD'
//       },
//       {
//         hospitalId: hospital._id,
//         name: 'Therapist Ravi',
//         email: 'ravi@rctech.com',
//         password: 'hashedpassword123',
//         role: 'therapist',   // ✅ HARDCODED STRING matches Enum
//         specialization: 'Panchakarma',
//       },
//     ]);
//     console.log('✅ Staff Created');

//     // 4. Create Rooms
//     console.log('🛏️ Creating Rooms...');
//     await roomModel.create([
//       {
//         hospitalId: hospital._id,
//         name: 'Room 101 (Wet Therapy)',
//         type: 'WET',
//         equipment: ['Steam Box', 'Droni Table']
//       },
//       {
//         hospitalId: hospital._id,
//         name: 'Room 102 (Massage)',
//         type: 'DRY',
//         equipment: ['Massage Table']
//       },
//     ]);
//     console.log('✅ Rooms Created');

//     await app.close();
//     process.exit(0);

//   } catch (error) {
//     console.error('❌ Error Seeding Data:', error);
//     process.exit(1);
//   }
// }

// bootstrap();


// import { NestFactory } from '@nestjs/core';
// import { AppModule } from '../src/app.module';
// import { getModelToken } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { Hospital } from '../src/hospitals/schemas/hospital.schema';
// import { User } from '../src/users/schemas/user.schema';
// import { Room } from '../src/rooms/schemas/room.schema';
// import * as bcrypt from 'bcrypt'; // ✅ 1. Import bcrypt

// async function bootstrap() {
//   try {
//     const app = await NestFactory.createApplicationContext(AppModule);

//     // ✅ Get direct access to the Mongoose Models
//     const hospitalModel = app.get<Model<Hospital>>(getModelToken(Hospital.name));
//     const userModel = app.get<Model<User>>(getModelToken(User.name));
//     const roomModel = app.get<Model<Room>>(getModelToken(Room.name));

//     // 1. Clear Data (Clean Slate)
//     console.log('🧹 Clearing old data...');
//     await hospitalModel.deleteMany({});
//     await userModel.deleteMany({});
//     await roomModel.deleteMany({});

//     // 2. Create Hospital
//     console.log('🏥 Creating Hospital...');
//     const hospital = await hospitalModel.create({
//       name: 'Yukti Herbs Ayurveda', // Updated to your hospital name
//       domain: 'yuktiherbs', 
//       city: 'Mohali',   
//       state: 'Punjab',
//       phone: '9876543210',
//       plan: 'PREMIUM'
//     });
//     console.log(`✅ Hospital Created: ${hospital.name}`);

//     // 3. Generate Secure Password Hash
//     // This allows you to login with "admin123" securely
//     const salt = await bcrypt.genSalt(10);
//     const commonPassword = await bcrypt.hash('admin123', salt);

//     // 4. Create Staff
//     console.log('👨‍⚕️ Creating Staff...');
//     await userModel.create([
//       {
//         hospitalId: hospital._id,
//         name: 'Rahul Chauhan', //
//         email: 'admin@rctech.com',
//         password: commonPassword, // ✅ HASHED
//         role: 'super_admin',
//         isActive: true
//       },
//       {
//         hospitalId: hospital._id,
//         name: 'Dr. Sharma',
//         email: 'doctor@rctech.com',
//         password: commonPassword, // ✅ HASHED
//         role: 'doctor',
//         specialization: 'Ayurveda MD'
//       },
//       {
//         hospitalId: hospital._id,
//         name: 'Therapist Ravi',
//         email: 'ravi@rctech.com',
//         password: commonPassword, // ✅ HASHED
//         role: 'therapist',
//         specialization: 'Panchakarma',
//       },
//     ]);
//     console.log('✅ Staff Created');

//     // 5. Create Rooms
//     console.log('🛏️ Creating Rooms...');
//     await roomModel.create([
//       {
//         hospitalId: hospital._id,
//         name: 'Panchakarma Room 1',
//         type: 'WET',
//         equipment: ['Steam Box', 'Droni Table']
//       },
//       {
//         hospitalId: hospital._id,
//         name: 'Massage Room A',
//         type: 'DRY',
//         equipment: ['Massage Table']
//       },
//     ]);
//     console.log('✅ Rooms Created');

//     await app.close();
//     console.log('🚀 Seeding Complete. Use "admin123" to login.');
//     process.exit(0);

//   } catch (error) {
//     console.error('❌ Error Seeding Data:', error);
//     process.exit(1);
//   }
// }

// bootstrap();

// import { NestFactory } from '@nestjs/core';
// // ✅ FIX: Point to ../src/ instead of ./
// import { AppModule } from '../src/app.module'; 
// import { getModelToken } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// // ✅ FIX: Point to ../src/
// import { Hospital } from '../src/hospitals/schemas/hospital.schema';
// import { User } from '../src/users/schemas/user.schema';
// import { Room } from '../src/rooms/schemas/room.schema';
// import * as bcrypt from 'bcrypt';

// async function bootstrap() {
//   try {
//     const app = await NestFactory.createApplicationContext(AppModule);

//     const hospitalModel = app.get<Model<Hospital>>(getModelToken(Hospital.name));
//     const userModel = app.get<Model<User>>(getModelToken(User.name));
//     const roomModel = app.get<Model<Room>>(getModelToken(Room.name));

//     // 1. CLEAR DATA
//     console.log('🧹 Clearing old data...');
//     await hospitalModel.deleteMany({});
//     await userModel.deleteMany({});
//     await roomModel.deleteMany({});

//     // 2. CREATE HOSPITAL
//     console.log('🏥 Creating Yukti Herbs Hospital...');
//     const hospital = await hospitalModel.create({
//       name: 'Yukti Herbs Ayurveda',
//       domain: 'yuktiherbs',
//       city: 'Mohali',
//       state: 'Punjab',
//       phone: '9876543210',
//       plan: 'PREMIUM'
//     });

//     // 3. GENERATE PASSWORD
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash('admin123', salt);

//     // 4. CREATE USERS
//     console.log('👥 Creating Staff Accounts...');
//     await userModel.create([
//       {
//         hospitalId: hospital._id,
//         name: 'Rahul Chauhan (Super)',
//         email: 'admin@rctech.com',
//         password: hashedPassword,
//         role: 'SUPER_ADMIN',
//         isActive: true
//       },
//       {
//         hospitalId: hospital._id,
//         name: 'Yukti Owner',
//         email: 'admin@yukti.com',
//         password: hashedPassword,
//         role: 'ADMIN',
//         isActive: true
//       },
//       {
//         hospitalId: hospital._id,
//         name: 'Dr. Ajay Sharma',
//         email: 'dr.ajay@yukti.com',
//         password: hashedPassword,
//         role: 'DOCTOR',
//         specialization: 'Ayurveda MD',
//         isActive: true
//       },
//       {
//         hospitalId: hospital._id,
//         name: 'Priya (Front Desk)',
//         email: 'reception@yukti.com',
//         password: hashedPassword,
//         role: 'RECEPTIONIST',
//         isActive: true
//       },
//       {
//         hospitalId: hospital._id,
//         name: 'Ravi Therapist',
//         email: 'ravi@yukti.com',
//         password: hashedPassword,
//         role: 'THERAPIST',
//         specialization: 'Panchakarma',
//         isActive: true
//       }
//     ]);

//     // 5. CREATE ROOMS
//     await roomModel.create([
//       { hospitalId: hospital._id, name: 'Panchakarma Room 1', type: 'WET' },
//       { hospitalId: hospital._id, name: 'Massage Room A', type: 'DRY' },
//     ]);

//     await app.close();
//     console.log('✅ Seeding Complete. Login with: admin@rctech.com / admin123');
//     process.exit(0);

//   } catch (error) {
//     console.error('❌ Seeding Failed:', error);
//     process.exit(1);
//   }
// }

// bootstrap();


// import { NestFactory } from '@nestjs/core';
// // ✅ FIX: Point to ../src/ instead of ./
// import { AppModule } from '../src/app.module'; 
// import { getModelToken } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// // ✅ FIX: Point to ../src/
// import { Hospital } from '../src/hospitals/schemas/hospital.schema';
// import { User } from '../src/users/schemas/user.schema';
// import { Room } from '../src/rooms/schemas/room.schema';
// import * as bcrypt from 'bcrypt';

// async function bootstrap() {
//   try {
//     const app = await NestFactory.createApplicationContext(AppModule);

//     const hospitalModel = app.get<Model<Hospital>>(getModelToken(Hospital.name));
//     const userModel = app.get<Model<User>>(getModelToken(User.name));
//     const roomModel = app.get<Model<Room>>(getModelToken(Room.name));

//     // 1. CLEAR DATA
//     console.log('🧹 Clearing old data...');
//     await hospitalModel.deleteMany({});
//     await userModel.deleteMany({});
//     await roomModel.deleteMany({});

//     // 2. CREATE HOSPITAL
//     console.log('🏥 Creating Yukti Herbs Hospital...');
//     const hospital = await hospitalModel.create({
//       name: 'Yukti Herbs Ayurveda',
//       domain: 'yuktiherbs',
//       city: 'Mohali',
//       state: 'Punjab',
//       phone: '9876543210',
//       plan: 'PREMIUM'
//     });

//     // 3. GENERATE PASSWORD
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash('admin123', salt);

//     // 4. CREATE USERS
//     console.log('👥 Creating Staff Accounts...');
//     await userModel.create([
//       {
//         hospitalId: hospital._id,
//         name: 'Rahul Chauhan (Super)',
//         email: 'admin@rctech.com',
//         password: hashedPassword,
//         role: 'SUPER_ADMIN',
//         isActive: true
//       },
//       {
//         hospitalId: hospital._id,
//         name: 'Yukti Owner',
//         email: 'admin@yukti.com',
//         password: hashedPassword,
//         role: 'ADMIN',
//         isActive: true
//       },
//       {
//         hospitalId: hospital._id,
//         name: 'Dr. Ajay Sharma',
//         email: 'dr.ajay@yukti.com',
//         password: hashedPassword,
//         role: 'DOCTOR',
//         specialization: 'Ayurveda MD',
//         isActive: true
//       },
//       {
//         hospitalId: hospital._id,
//         name: 'Priya (Front Desk)',
//         email: 'reception@yukti.com',
//         password: hashedPassword,
//         role: 'RECEPTIONIST',
//         isActive: true
//       },
//       {
//         hospitalId: hospital._id,
//         name: 'Ravi Therapist',
//         email: 'ravi@yukti.com',
//         password: hashedPassword,
//         role: 'THERAPIST',
//         specialization: 'Panchakarma',
//         isActive: true
//       },
//       // 💊 NEW: PHARMACIST ACCOUNT
//       {
//         hospitalId: hospital._id,
//         name: 'Main Pharmacy Desk',
//         email: 'pharmacist@yukti.com',
//         password: hashedPassword,
//         role: 'PHARMACIST',
//         isActive: true
//       }
//     ]);

//     // 5. CREATE ROOMS
//     await roomModel.create([
//       { hospitalId: hospital._id, name: 'Panchakarma Room 1', type: 'WET' },
//       { hospitalId: hospital._id, name: 'Massage Room A', type: 'DRY' },
//     ]);

//     await app.close();
//     console.log('✅ Seeding Complete. Login with: admin@rctech.com / admin123');
//     console.log('💊 Pharmacy Login: pharmacist@yukti.com / admin123');
//     process.exit(0);

//   } catch (error) {
//     console.error('❌ Seeding Failed:', error);
//     process.exit(1);
//   }
// }

// bootstrap();


// import { NestFactory } from '@nestjs/core';
// // ✅ FIX: Point to ../src/ instead of ./
// import { AppModule } from '../src/app.module'; 
// import { getModelToken } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// // ✅ FIX: Point to ../src/
// import { Hospital } from '../src/hospitals/schemas/hospital.schema';
// import { User } from '../src/users/schemas/user.schema';
// import { Room } from '../src/rooms/schemas/room.schema';
// import * as bcrypt from 'bcrypt';

// async function bootstrap() {
//   try {
//     const app = await NestFactory.createApplicationContext(AppModule);

//     const hospitalModel = app.get<Model<Hospital>>(getModelToken(Hospital.name));
//     const userModel = app.get<Model<User>>(getModelToken(User.name));
//     const roomModel = app.get<Model<Room>>(getModelToken(Room.name));

//     // 1. CLEAR DATA
//     console.log('🧹 Clearing old data...');
//     await hospitalModel.deleteMany({});
//     await userModel.deleteMany({});
//     await roomModel.deleteMany({});

//     // 2. CREATE HOSPITAL
//     console.log('🏥 Creating Yukti Herbs Hospital...');
//     const hospital = await hospitalModel.create({
//       name: 'Yukti Herbs Ayurveda',
//       domain: 'yuktiherbs',
//       city: 'Mohali',
//       state: 'Punjab',
//       phone: '9876543210',
//       plan: 'PREMIUM'
//     });

//     // 3. GENERATE PASSWORD
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash('admin123', salt);

//     // 4. CREATE USERS
//     console.log('👥 Creating Staff Accounts...');
//     await userModel.create([
//       {
//         hospitalId: hospital._id,
//         name: 'Rahul Chauhan (Super)',
//         email: 'admin@rctech.com',
//         password: hashedPassword,
//         role: 'SUPER_ADMIN',
//         isActive: true
//       },
//       {
//         hospitalId: hospital._id,
//         name: 'Yukti Owner',
//         email: 'admin@yukti.com',
//         password: hashedPassword,
//         role: 'ADMIN',
//         isActive: true
//       },
//       {
//         hospitalId: hospital._id,
//         name: 'Dr. Ajay Sharma',
//         email: 'dr.ajay@yukti.com',
//         password: hashedPassword,
//         role: 'DOCTOR',
//         specialization: 'Ayurveda MD',
//         isActive: true
//       },
//       {
//         hospitalId: hospital._id,
//         name: 'Priya (Front Desk)',
//         email: 'reception@yukti.com',
//         password: hashedPassword,
//         role: 'RECEPTIONIST',
//         isActive: true
//       },
//       {
//         hospitalId: hospital._id,
//         name: 'Ravi Therapist',
//         email: 'ravi@yukti.com',
//         password: hashedPassword,
//         role: 'THERAPIST',
//         specialization: 'Panchakarma',
//         isActive: true
//       },
//       {
//         hospitalId: hospital._id,
//         name: 'Main Pharmacy Desk',
//         email: 'pharmacist@yukti.com',
//         password: hashedPassword,
//         role: 'PHARMACIST',
//         isActive: true
//       },
//       // 🚀 NEW: TELE-SALES / TELECALLER ACCOUNT
//       {
//         hospitalId: hospital._id,
//         name: 'Sonia (Tele-Sales)',
//         email: 'telecaller@yukti.com',
//         password: hashedPassword,
//         role: 'TELECALLER',
//         isActive: true
//       }
//     ]);

//     // 5. CREATE ROOMS
//     await roomModel.create([
//       { hospitalId: hospital._id, name: 'Panchakarma Room 1', type: 'WET' },
//       { hospitalId: hospital._id, name: 'Massage Room A', type: 'DRY' },
//     ]);

//     await app.close();
//     console.log('✅ Seeding Complete. Login with: admin@rctech.com / admin123');
//     console.log('📞 Telecaller Login: telecaller@yukti.com / admin123');
//     console.log('💊 Pharmacy Login: pharmacist@yukti.com / admin123');
//     process.exit(0);

//   } catch (error) {
//     console.error('❌ Seeding Failed:', error);
//     process.exit(1);
//   }
// }

// bootstrap();
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module'; 
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Hospital } from '../src/hospitals/schemas/hospital.schema';
import { User } from '../src/users/schemas/user.schema';
import { Room } from '../src/rooms/schemas/room.schema';
import * as bcrypt from 'bcrypt';

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

    // 🚀 2. CREATE SYSTEM TENANT (For Super Admin Only)
    // Casing must match schema enum exactly: 'Active'
    console.log('🛡️ Creating Veda System Tenant...');
    const systemTenant = await hospitalModel.create({
      name: 'VEDA ERP HEADQUARTERS',
      domain: 'system',
      city: 'Digital',
      state: 'Global',
      phone: '0000000000',
      plan: 'PREMIUM', // Matches enum: ['BASIC', 'PREMIUM']
      status: 'Active'  // Matches enum: ['Active', 'Inactive']
    });

    // 3. CREATE CLIENT HOSPITAL (Yukti Herbs)
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

    // 4. GENERATE SECURE PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // 5. CREATE USERS
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

    // 6. CREATE ROOMS FOR YUKTI
    await roomModel.create([
      { hospitalId: yuktiHospital._id, name: 'Panchakarma Room 1', type: 'WET' },
      { hospitalId: yuktiHospital._id, name: 'Massage Room A', type: 'DRY' },
    ]);

    await app.close();
    console.log('--- SEEDING COMPLETE ---');
    console.log('✅ ERP OWNER: admin@rctech.com (Isolated from client hospitals)');
    console.log('✅ YUKTI ADMIN: admin@yukti.com');
    process.exit(0);

  } catch (error) {
    console.error('❌ Seeding Failed:', error);
    process.exit(1);
  }
}

bootstrap();