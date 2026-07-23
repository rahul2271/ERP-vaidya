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
exports.AppointmentSchema = exports.Appointment = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Appointment = class Appointment {
    hospitalId;
    patientId;
    doctorId;
    therapistId;
    roomId;
    bookedById;
    treatmentName;
    startTime;
    endTime;
    status;
    paymentStatus;
    paymentMode;
    amount;
    finalBilledAmount;
    discount;
    medicinesUsed;
    vitals;
    chiefComplaints;
    diagnosis;
    nextFollowUpDate;
    recommendedTherapies;
    room;
    mode;
    meetLink;
    visitType;
    opdNumber;
    ipdNumber;
    dayCareNumber;
    admissionDate;
    dischargeDate;
    dischargeCondition;
    dischargeAdvice;
};
exports.Appointment = Appointment;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Hospital', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Appointment.prototype, "hospitalId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Patient', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Appointment.prototype, "patientId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Appointment.prototype, "doctorId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Appointment.prototype, "therapistId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Room', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Appointment.prototype, "roomId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Appointment.prototype, "bookedById", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Appointment.prototype, "treatmentName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Appointment.prototype, "startTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Appointment.prototype, "endTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        default: 'SCHEDULED',
        enum: ['SCHEDULED', 'WAITING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'BOOKED']
    }),
    __metadata("design:type", String)
], Appointment.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        default: 'PENDING',
        enum: ['PENDING', 'PAID', 'PARTIAL']
    }),
    __metadata("design:type", String)
], Appointment.prototype, "paymentStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        default: 'UNPAID',
        enum: ['UNPAID', 'CASH', 'UPI', 'CARD', 'BANK_TRANSFER']
    }),
    __metadata("design:type", String)
], Appointment.prototype, "paymentMode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Appointment.prototype, "amount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Appointment.prototype, "finalBilledAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            percentage: { type: Number, default: 0 },
            amount: { type: Number, default: 0 }
        },
        default: { percentage: 0, amount: 0 },
        _id: false
    }),
    __metadata("design:type", Object)
], Appointment.prototype, "discount", void 0);
__decorate([
    (0, mongoose_1.Prop)([{
            inventoryId: { type: mongoose_2.Types.ObjectId, ref: 'Inventory', required: true },
            quantity: { type: Number, required: true, min: 1 },
            priceAtTime: { type: Number, default: 0 }
        }]),
    __metadata("design:type", Array)
], Appointment.prototype, "medicinesUsed", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            preBp: { type: String, default: 'N/A' },
            postBp: { type: String, default: 'N/A' },
            pulse: { type: String, default: 'N/A' },
            weight: { type: String, default: 'N/A' },
            notes: { type: String, default: '' },
        },
        default: {},
        _id: false
    }),
    __metadata("design:type", Object)
], Appointment.prototype, "vitals", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: "" }),
    __metadata("design:type", String)
], Appointment.prototype, "chiefComplaints", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: "" }),
    __metadata("design:type", String)
], Appointment.prototype, "diagnosis", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", String)
], Appointment.prototype, "nextFollowUpDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{
                treatmentName: { type: String, required: true },
                notes: { type: String, default: "" },
                estimatedCost: { type: Number, default: 0 },
                isProcessed: { type: Boolean, default: false }
            }],
        default: []
    }),
    __metadata("design:type", Array)
], Appointment.prototype, "recommendedTherapies", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Appointment.prototype, "room", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['IN_PERSON', 'ONLINE'], default: 'IN_PERSON' }),
    __metadata("design:type", String)
], Appointment.prototype, "mode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: "" }),
    __metadata("design:type", String)
], Appointment.prototype, "meetLink", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['OPD', 'IPD', 'DAY_CARE'], default: 'OPD' }),
    __metadata("design:type", String)
], Appointment.prototype, "visitType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", String)
], Appointment.prototype, "opdNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", String)
], Appointment.prototype, "ipdNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", String)
], Appointment.prototype, "dayCareNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: null }),
    __metadata("design:type", Date)
], Appointment.prototype, "admissionDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: null }),
    __metadata("design:type", Date)
], Appointment.prototype, "dischargeDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", String)
], Appointment.prototype, "dischargeCondition", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", String)
], Appointment.prototype, "dischargeAdvice", void 0);
exports.Appointment = Appointment = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Appointment);
exports.AppointmentSchema = mongoose_1.SchemaFactory.createForClass(Appointment);
exports.AppointmentSchema.index({ doctorId: 1, startTime: 1 }, { unique: true });
//# sourceMappingURL=appointment.schema.js.map