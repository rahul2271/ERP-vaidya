import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SuperAdminController } from './super-admin.controller';
import { SuperAdminService } from './super-admin.service';
import { Hospital, HospitalSchema } from '../hospitals/schemas/hospital.schema';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  // 🚀 Import the schemas so the Service can use them!
  imports: [
    MongooseModule.forFeature([
      { name: Hospital.name, schema: HospitalSchema },
      { name: User.name, schema: UserSchema }
    ])
  ],
  controllers: [SuperAdminController],
  providers: [SuperAdminService],
})
export class SuperAdminModule {}