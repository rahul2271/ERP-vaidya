"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const appointments_service_1 = require("./appointments.service");
const appointments_controller_1 = require("./appointments.controller");
const appointment_schema_1 = require("./schemas/appointment.schema");
const treatment_schema_1 = require("../treatments/schemas/treatment.schema");
const whatsapp_module_1 = require("../whatsapp/whatsapp.module");
const common_module_1 = require("../common/common.module");
const hospitals_module_1 = require("../hospitals/hospitals.module");
const pdf_service_1 = require("../patients/pdf.service");
const audit_logs_module_1 = require("../audit-logs/audit-logs.module");
let AppointmentsModule = class AppointmentsModule {
};
exports.AppointmentsModule = AppointmentsModule;
exports.AppointmentsModule = AppointmentsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: appointment_schema_1.Appointment.name, schema: appointment_schema_1.AppointmentSchema },
                { name: treatment_schema_1.Treatment.name, schema: treatment_schema_1.TreatmentSchema },
            ]),
            whatsapp_module_1.WhatsAppModule,
            common_module_1.CommonModule,
            hospitals_module_1.HospitalsModule,
            audit_logs_module_1.AuditLogsModule,
        ],
        controllers: [appointments_controller_1.AppointmentsController],
        providers: [appointments_service_1.AppointmentsService, pdf_service_1.PdfService],
        exports: [appointments_service_1.AppointmentsService],
    })
], AppointmentsModule);
//# sourceMappingURL=appointments.module.js.map