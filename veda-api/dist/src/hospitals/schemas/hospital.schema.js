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
exports.HospitalSchema = exports.Hospital = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let Hospital = class Hospital {
    name;
    logo;
    tagline;
    email;
    phone;
    address;
    city;
    state;
    gstNumber;
    registrationNumber;
    domain;
    plan;
    status;
    subscriptionExpiry;
    subscriptionStatus;
    trialEndsAt;
    planRenewsAt;
    billingCycle;
    tallyConfig;
    config;
    whatsappConfig;
    smtpConfig;
};
exports.Hospital = Hospital;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Hospital.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: "" }),
    __metadata("design:type", String)
], Hospital.prototype, "logo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: "" }),
    __metadata("design:type", String)
], Hospital.prototype, "tagline", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Hospital.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Hospital.prototype, "phone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: "" }),
    __metadata("design:type", String)
], Hospital.prototype, "address", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Hospital.prototype, "city", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Hospital.prototype, "state", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: "" }),
    __metadata("design:type", String)
], Hospital.prototype, "gstNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: "" }),
    __metadata("design:type", String)
], Hospital.prototype, "registrationNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Hospital.prototype, "domain", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['BASIC', 'PREMIUM'], default: 'BASIC' }),
    __metadata("design:type", String)
], Hospital.prototype, "plan", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['Active', 'Inactive'], default: 'Active' }),
    __metadata("design:type", String)
], Hospital.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], Hospital.prototype, "subscriptionExpiry", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['TRIALING', 'ACTIVE', 'TRIAL_EXPIRED'], default: 'TRIALING' }),
    __metadata("design:type", String)
], Hospital.prototype, "subscriptionStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], Hospital.prototype, "trialEndsAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], Hospital.prototype, "planRenewsAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['monthly', 'annually'], default: 'monthly' }),
    __metadata("design:type", String)
], Hospital.prototype, "billingCycle", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            serverUrl: { type: String, default: null },
            companyName: { type: String, default: null },
            lastSyncedAt: { type: Date, default: null },
            lastSyncStatus: { type: String, default: null },
        },
        _id: false,
        default: null,
    }),
    __metadata("design:type", Object)
], Hospital.prototype, "tallyConfig", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: { startTime: "09:00", endTime: "18:00" } }),
    __metadata("design:type", Object)
], Hospital.prototype, "config", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            accessToken: { type: String, default: null },
            phoneId: { type: String, default: null },
            businessAccountId: { type: String, default: null },
            verifyToken: { type: String, default: null },
        },
        _id: false,
        default: null,
    }),
    __metadata("design:type", Object)
], Hospital.prototype, "whatsappConfig", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            host: { type: String, default: null },
            port: { type: Number, default: 587 },
            user: { type: String, default: null },
            pass: { type: String, default: null },
            fromEmail: { type: String, default: null },
            fromName: { type: String, default: null },
        },
        _id: false,
        default: null,
    }),
    __metadata("design:type", Object)
], Hospital.prototype, "smtpConfig", void 0);
exports.Hospital = Hospital = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Hospital);
exports.HospitalSchema = mongoose_1.SchemaFactory.createForClass(Hospital);
//# sourceMappingURL=hospital.schema.js.map