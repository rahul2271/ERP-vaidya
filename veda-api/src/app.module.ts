import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { HospitalsModule } from './hospitals/hospitals.module';
import { UsersModule } from './users/users.module';
import { RoomsModule } from './rooms/rooms.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { PatientsModule } from './patients/patients.module';
import { InventoryModule } from './inventory/inventory.module';
import { AuthModule } from './auth/auth.module';
import { TreatmentsModule } from './treatments/treatments.module';
import { PharmacyModule } from './pharmacy/pharmacy.module';
import { TherapiesModule } from './therapies/therapies.module';
import { LeadsModule } from './leads/leads.module';
import { SettingsModule } from './settings/settings.module';
import { SuperAdminModule } from './super-admin/super-admin.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { TasksModule } from './tasks/tasks.module';
import { ChatModule } from './chat/chat.module';
import { WhatsAppModule } from './whatsapp/whatsapp.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { NoticesModule } from './notices/notices.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { CallsModule } from './calls/calls.module';
import { PaymentsModule } from './payments/payments.module';
import { CommonModule } from './common/common.module';
import { BlogModule } from './blog/blog.module';
import { TallyModule } from './tally/tally.module';

@Module({
  imports: [
    // Load .env (and inject real OS env vars in production) globally before anything else needs it
    ConfigModule.forRoot({ isGlobal: true }),

    // Serve static files directly from the root 'public' folder
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),
      serveStaticOptions: {
        index: false,
      },
    }),

    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/vedaerp'),
    HospitalsModule,
    UsersModule,
    RoomsModule,
    AppointmentsModule,
    PatientsModule,
    AuthModule,
    InventoryModule,
    TreatmentsModule,
    PharmacyModule,
    TherapiesModule,
    LeadsModule,
    SettingsModule,
    SuperAdminModule,
    DashboardModule,
    TasksModule,
    ChatModule,
    WhatsAppModule,
    NoticesModule,
    AuditLogsModule,
    CallsModule,
    PaymentsModule,
    CommonModule,
    BlogModule,
    TallyModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
