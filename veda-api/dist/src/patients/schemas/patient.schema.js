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
exports.PatientSchema = exports.Patient = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Patient = class Patient {
    hospitalId;
    uhid;
    assignedDoctorId;
    name;
    mobile;
    age;
    gender;
    address;
    prakriti;
    medicalHistory;
    chiefComplaints;
    diagnosis;
    prakritiToken;
    prakritiScores;
};
exports.Patient = Patient;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Hospital', required: true, index: true }),
    __metadata("design:type", Object)
], Patient.prototype, "hospitalId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Patient.prototype, "uhid", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: false, index: true }),
    __metadata("design:type", Object)
], Patient.prototype, "assignedDoctorId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Patient.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Patient.prototype, "mobile", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Patient.prototype, "age", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['Male', 'Female', 'Other', 'M', 'F', 'O'] }),
    __metadata("design:type", String)
], Patient.prototype, "gender", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Patient.prototype, "address", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Patient.prototype, "prakriti", void 0);
__decorate([
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], Patient.prototype, "medicalHistory", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Patient.prototype, "chiefComplaints", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Patient.prototype, "diagnosis", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Patient.prototype, "prakritiToken", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Patient.prototype, "prakritiScores", void 0);
exports.Patient = Patient = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Patient);
exports.PatientSchema = mongoose_1.SchemaFactory.createForClass(Patient);
exports.PatientSchema.index({ hospitalId: 1, mobile: 1 }, { unique: true });
exports.PatientSchema.index({ hospitalId: 1, uhid: 1 }, { unique: true, sparse: true });
//# sourceMappingURL=patient.schema.js.map