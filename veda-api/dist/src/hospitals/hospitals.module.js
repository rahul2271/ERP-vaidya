"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HospitalsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const hospitals_service_1 = require("./hospitals.service");
const hospitals_controller_1 = require("./hospitals.controller");
const hospital_schema_1 = require("./schemas/hospital.schema");
let HospitalsModule = class HospitalsModule {
};
exports.HospitalsModule = HospitalsModule;
exports.HospitalsModule = HospitalsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: hospital_schema_1.Hospital.name, schema: hospital_schema_1.HospitalSchema }])
        ],
        controllers: [hospitals_controller_1.HospitalsController],
        providers: [hospitals_service_1.HospitalsService],
        exports: [hospitals_service_1.HospitalsService, mongoose_1.MongooseModule],
    })
], HospitalsModule);
//# sourceMappingURL=hospitals.module.js.map