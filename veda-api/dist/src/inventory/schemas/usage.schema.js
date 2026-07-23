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
exports.InventoryUsageSchema = exports.InventoryUsage = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let InventoryUsage = class InventoryUsage extends mongoose_2.Document {
    inventoryId;
    appointmentId;
    quantityUsed;
    hospitalId;
};
exports.InventoryUsage = InventoryUsage;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Inventory', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], InventoryUsage.prototype, "inventoryId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Appointment', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], InventoryUsage.prototype, "appointmentId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], InventoryUsage.prototype, "quantityUsed", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Hospital', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], InventoryUsage.prototype, "hospitalId", void 0);
exports.InventoryUsage = InventoryUsage = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], InventoryUsage);
exports.InventoryUsageSchema = mongoose_1.SchemaFactory.createForClass(InventoryUsage);
//# sourceMappingURL=usage.schema.js.map