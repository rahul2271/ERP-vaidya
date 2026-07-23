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
exports.CounterSchema = exports.Counter = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Counter = class Counter {
    hospitalId;
    type;
    year;
    seq;
};
exports.Counter = Counter;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Hospital', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Counter.prototype, "hospitalId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['UHID', 'OPD', 'IPD', 'DAY_CARE'] }),
    __metadata("design:type", String)
], Counter.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Counter.prototype, "year", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], Counter.prototype, "seq", void 0);
exports.Counter = Counter = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Counter);
exports.CounterSchema = mongoose_1.SchemaFactory.createForClass(Counter);
exports.CounterSchema.index({ hospitalId: 1, type: 1, year: 1 }, { unique: true });
//# sourceMappingURL=counter.schema.js.map