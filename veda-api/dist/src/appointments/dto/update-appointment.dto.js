"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAppointmentDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_appointment_dto_1 = require("./create-appointment.dto");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class MedicineUsedDto {
    inventoryId;
    quantity;
    priceAtTime;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MedicineUsedDto.prototype, "inventoryId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], MedicineUsedDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], MedicineUsedDto.prototype, "priceAtTime", void 0);
class RecommendedTherapyDto {
    treatmentName;
    notes;
    isProcessed;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecommendedTherapyDto.prototype, "treatmentName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecommendedTherapyDto.prototype, "notes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], RecommendedTherapyDto.prototype, "isProcessed", void 0);
class UpdateAppointmentDto extends (0, mapped_types_1.PartialType)(create_appointment_dto_1.CreateAppointmentDto) {
    status;
    vitals;
    medicinesUsed;
    chiefComplaints;
    diagnosis;
    nextFollowUpDate;
    recommendedTherapies;
}
exports.UpdateAppointmentDto = UpdateAppointmentDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAppointmentDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateAppointmentDto.prototype, "vitals", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => MedicineUsedDto),
    __metadata("design:type", Array)
], UpdateAppointmentDto.prototype, "medicinesUsed", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAppointmentDto.prototype, "chiefComplaints", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAppointmentDto.prototype, "diagnosis", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAppointmentDto.prototype, "nextFollowUpDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => RecommendedTherapyDto),
    __metadata("design:type", Array)
], UpdateAppointmentDto.prototype, "recommendedTherapies", void 0);
//# sourceMappingURL=update-appointment.dto.js.map