"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const hospitals_module_1 = require("./hospitals/hospitals.module");
const users_module_1 = require("./users/users.module");
const rooms_module_1 = require("./rooms/rooms.module");
const appointments_module_1 = require("./appointments/appointments.module");
const patients_module_1 = require("./patients/patients.module");
const inventory_module_1 = require("./inventory/inventory.module");
const auth_module_1 = require("./auth/auth.module");
const treatments_module_1 = require("./treatments/treatments.module");
const pharmacy_module_1 = require("./pharmacy/pharmacy.module");
const therapies_module_1 = require("./therapies/therapies.module");
const leads_module_1 = require("./leads/leads.module");
const settings_module_1 = require("./settings/settings.module");
const super_admin_module_1 = require("./super-admin/super-admin.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const tasks_module_1 = require("./tasks/tasks.module");
const chat_module_1 = require("./chat/chat.module");
const whatsapp_module_1 = require("./whatsapp/whatsapp.module");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const notices_module_1 = require("./notices/notices.module");
const audit_logs_module_1 = require("./audit-logs/audit-logs.module");
const calls_module_1 = require("./calls/calls.module");
const payments_module_1 = require("./payments/payments.module");
const common_module_1 = require("./common/common.module");
const blog_module_1 = require("./blog/blog.module");
const tally_module_1 = require("./tally/tally.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(process.cwd(), 'public'),
                serveStaticOptions: {
                    index: false,
                },
            }),
            mongoose_1.MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/vedaerp'),
            hospitals_module_1.HospitalsModule,
            users_module_1.UsersModule,
            rooms_module_1.RoomsModule,
            appointments_module_1.AppointmentsModule,
            patients_module_1.PatientsModule,
            auth_module_1.AuthModule,
            inventory_module_1.InventoryModule,
            treatments_module_1.TreatmentsModule,
            pharmacy_module_1.PharmacyModule,
            therapies_module_1.TherapiesModule,
            leads_module_1.LeadsModule,
            settings_module_1.SettingsModule,
            super_admin_module_1.SuperAdminModule,
            dashboard_module_1.DashboardModule,
            tasks_module_1.TasksModule,
            chat_module_1.ChatModule,
            whatsapp_module_1.WhatsAppModule,
            notices_module_1.NoticesModule,
            audit_logs_module_1.AuditLogsModule,
            calls_module_1.CallsModule,
            payments_module_1.PaymentsModule,
            common_module_1.CommonModule,
            blog_module_1.BlogModule,
            tally_module_1.TallyModule,
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map