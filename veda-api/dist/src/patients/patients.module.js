"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const patients_service_1 = require("./patients.service");
const patients_controller_1 = require("./patients.controller");
const patient_schema_1 = require("./schemas/patient.schema");
const appointment_schema_1 = require("../appointments/schemas/appointment.schema");
const appointments_module_1 = require("../appointments/appointments.module");
const pdf_service_1 = require("./pdf.service");
const whatsapp_module_1 = require("../whatsapp/whatsapp.module");
const hospitals_module_1 = require("../hospitals/hospitals.module");
const common_module_1 = require("../common/common.module");
const audit_logs_module_1 = require("../audit-logs/audit-logs.module");
let PatientsModule = class PatientsModule {
};
exports.PatientsModule = PatientsModule;
exports.PatientsModule = PatientsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: patient_schema_1.Patient.name, schema: patient_schema_1.PatientSchema },
                { name: appointment_schema_1.Appointment.name, schema: appointment_schema_1.AppointmentSchema },
            ]),
            appointments_module_1.AppointmentsModule,
            whatsapp_module_1.WhatsAppModule,
            hospitals_module_1.HospitalsModule,
            common_module_1.CommonModule,
            audit_logs_module_1.AuditLogsModule,
        ],
        controllers: [patients_controller_1.PatientsController],
        providers: [
            patients_service_1.PatientsService,
            pdf_service_1.PdfService
        ],
    })
], PatientsModule);
//# sourceMappingURL=patients.module.js.map