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
exports.LeadSchema = exports.Lead = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Lead = class Lead {
    hospitalId;
    patientName;
    phone;
    source;
    status;
    assignedTo;
    medicalHistoryNotes;
    convertedPatientId;
    preferredDoctor;
    problem;
    city;
};
exports.Lead = Lead;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Hospital', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Lead.prototype, "hospitalId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Lead.prototype, "patientName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Lead.prototype, "phone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'Facebook Ads' }),
    __metadata("design:type", String)
], Lead.prototype, "source", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: ['NEW', 'ASSIGNED', 'CONTACTED', 'BOOKED', 'NOT_INTERESTED'],
        default: 'NEW'
    }),
    __metadata("design:type", String)
], Lead.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', default: null }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Lead.prototype, "assignedTo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: "" }),
    __metadata("design:type", String)
], Lead.prototype, "medicalHistoryNotes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Patient', default: null }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Lead.prototype, "convertedPatientId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: "Unspecified" }),
    __metadata("design:type", String)
], Lead.prototype, "preferredDoctor", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: "" }),
    __metadata("design:type", String)
], Lead.prototype, "problem", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: "" }),
    __metadata("design:type", String)
], Lead.prototype, "city", void 0);
exports.Lead = Lead = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Lead);
exports.LeadSchema = mongoose_1.SchemaFactory.createForClass(Lead);
//# sourceMappingURL=lead.schema.js.map