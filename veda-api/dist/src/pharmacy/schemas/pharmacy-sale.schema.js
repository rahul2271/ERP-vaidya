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
exports.PharmacySaleSchema = exports.PharmacySale = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let PharmacySale = class PharmacySale {
    hospitalId;
    customerName;
    customerPhone;
    patientId;
    items;
    subtotal;
    discount;
    grandTotal;
    paymentMode;
    paymentStatus;
    soldBy;
};
exports.PharmacySale = PharmacySale;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Hospital', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], PharmacySale.prototype, "hospitalId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], PharmacySale.prototype, "customerName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PharmacySale.prototype, "customerPhone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Patient', default: null }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], PharmacySale.prototype, "patientId", void 0);
__decorate([
    (0, mongoose_1.Prop)([{
            inventoryId: { type: mongoose_2.Types.ObjectId, ref: 'Inventory', required: true },
            name: { type: String, required: true },
            quantity: { type: Number, required: true, min: 1 },
            unitPrice: { type: Number, required: true },
            lineTotal: { type: Number, required: true }
        }]),
    __metadata("design:type", Array)
], PharmacySale.prototype, "items", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], PharmacySale.prototype, "subtotal", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: { percentage: { type: Number, default: 0 }, amount: { type: Number, default: 0 } },
        default: { percentage: 0, amount: 0 },
        _id: false
    }),
    __metadata("design:type", Object)
], PharmacySale.prototype, "discount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], PharmacySale.prototype, "grandTotal", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['CASH', 'UPI', 'CARD'] }),
    __metadata("design:type", String)
], PharmacySale.prototype, "paymentMode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'PAID' }),
    __metadata("design:type", String)
], PharmacySale.prototype, "paymentStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], PharmacySale.prototype, "soldBy", void 0);
exports.PharmacySale = PharmacySale = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], PharmacySale);
exports.PharmacySaleSchema = mongoose_1.SchemaFactory.createForClass(PharmacySale);
//# sourceMappingURL=pharmacy-sale.schema.js.map