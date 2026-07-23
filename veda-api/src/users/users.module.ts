// // import { Module } from '@nestjs/common';
// // import { UsersService } from './users.service';
// // import { UsersController } from './users.controller';

// // @Module({
// //   controllers: [UsersController],
// //   providers: [UsersService],
// // })
// // export class UsersModule {}


// // src/users/users.module.ts
// import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { UsersService } from './users.service';
// import { UsersController } from './users.controller';
// import { User, UserSchema } from './schemas/user.schema';

// @Module({
//   imports: [
//     MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
//   ],
//   controllers: [UsersController],
//   providers: [UsersService],
//   exports: [MongooseModule], // <--- Exporting for Seed script
// })
// export class UsersModule {}

// import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { UsersService } from './users.service';
// import { UsersController } from './users.controller';
// import { User, UserSchema } from './schemas/user.schema';

// @Module({
//   imports: [
//     MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
//   ],
//   controllers: [UsersController],
//   providers: [UsersService],
//   exports: [MongooseModule], // <--- CHECK THIS
// })
// export class UsersModule {}

// import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { UsersService } from './users.service';
// import { UsersController } from './users.controller';
// import { User, UserSchema } from './schemas/user.schema';

// @Module({
//   imports: [
//     MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
//   ],
//   controllers: [UsersController],
//   providers: [UsersService],
//   // ✅ CRITICAL: You must export the service to use it in AuthModule
//   exports: [UsersService], 
// })
// export class UsersModule {}


import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './schemas/user.schema';
import { HospitalsModule } from '../hospitals/hospitals.module'; // 🚀 1. ADDED IMPORT
// 🚀 2. Import the new AuditLogsModule
import { AuditLogsModule } from '../audit-logs/audit-logs.module'; 

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    HospitalsModule, // 🚀 Allows UsersService to check hospital plans!
    AuditLogsModule, // 🚀 Allows UsersService to log staff updates (like attendance)!
  ],
  controllers: [UsersController],
  providers: [UsersService],
  // ✅ CRITICAL: You must export the service to use it in AuthModule
  exports: [UsersService], 
})
export class UsersModule {}