"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TallyModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const inventory_schema_1 = require("../inventory/schemas/inventory.schema");
const appointment_schema_1 = require("../appointments/schemas/appointment.schema");
const hospitals_module_1 = require("../hospitals/hospitals.module");
const tally_service_1 = require("./tally.service");
const tally_controller_1 = require("./tally.controller");
let TallyModule = class TallyModule {
};
exports.TallyModule = TallyModule;
exports.TallyModule = TallyModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: inventory_schema_1.Inventory.name, schema: inventory_schema_1.InventorySchema },
                { name: appointment_schema_1.Appointment.name, schema: appointment_schema_1.AppointmentSchema },
            ]),
            hospitals_module_1.HospitalsModule,
        ],
        controllers: [tally_controller_1.TallyController],
        providers: [tally_service_1.TallyService],
    })
], TallyModule);
//# sourceMappingURL=tally.module.js.map