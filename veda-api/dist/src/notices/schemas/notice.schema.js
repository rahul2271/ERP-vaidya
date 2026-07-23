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
exports.NoticeSchema = exports.Notice = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Notice = class Notice {
    hospitalId;
    authorId;
    title;
    message;
    status;
};
exports.Notice = Notice;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Hospital', required: true, index: true }),
    __metadata("design:type", Object)
], Notice.prototype, "hospitalId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", Object)
], Notice.prototype, "authorId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Notice.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Notice.prototype, "message", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['PENDING', 'PUBLISHED', 'REJECTED'], default: 'PENDING' }),
    __metadata("design:type", String)
], Notice.prototype, "status", void 0);
exports.Notice = Notice = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Notice);
exports.NoticeSchema = mongoose_1.SchemaFactory.createForClass(Notice);
//# sourceMappingURL=notice.schema.js.map