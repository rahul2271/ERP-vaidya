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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CounterService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const counter_schema_1 = require("./schemas/counter.schema");
const PREFIXES = {
    UHID: 'UHID',
    OPD: 'OPD',
    IPD: 'IPD',
    DAY_CARE: 'DC',
};
let CounterService = class CounterService {
    counterModel;
    constructor(counterModel) {
        this.counterModel = counterModel;
    }
    async nextSeq(hospitalId, type) {
        const year = new Date().getFullYear();
        const counter = await this.counterModel.findOneAndUpdate({ hospitalId: new mongoose_2.Types.ObjectId(hospitalId), type, year }, { $inc: { seq: 1 } }, { upsert: true, new: true }).exec();
        return { seq: counter.seq, year };
    }
    async generateNumber(hospitalId, type, prefixOverride) {
        const { seq, year } = await this.nextSeq(hospitalId, type);
        const prefix = prefixOverride || PREFIXES[type];
        return `${prefix}-${year}-${String(seq).padStart(5, '0')}`;
    }
};
exports.CounterService = CounterService;
exports.CounterService = CounterService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(counter_schema_1.Counter.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CounterService);
//# sourceMappingURL=counter.service.js.map