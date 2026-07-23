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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var RazorpayService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RazorpayService = exports.PLAN_PRICING = void 0;
const common_1 = require("@nestjs/common");
const razorpay_1 = __importDefault(require("razorpay"));
const settings_service_1 = require("../settings/settings.service");
exports.PLAN_PRICING = {
    BASIC: { monthly: 2499, annually: 24990 },
    PREMIUM: { monthly: 5999, annually: 59990 },
};
let RazorpayService = RazorpayService_1 = class RazorpayService {
    settingsService;
    logger = new common_1.Logger(RazorpayService_1.name);
    constructor(settingsService) {
        this.settingsService = settingsService;
    }
    async createOrder(hospitalId, plan, billingCycle = 'monthly') {
        const settings = await this.settingsService.getGlobalSettings();
        if (!settings.razorpayKey) {
            throw new Error('Razorpay Key is missing in Global Settings. Add it before enabling upgrades.');
        }
        if (!process.env.RAZORPAY_SECRET) {
            throw new Error('RAZORPAY_SECRET is not set in the environment.');
        }
        const amount = exports.PLAN_PRICING[plan]?.[billingCycle];
        if (!amount) {
            throw new Error(`Unknown plan/cycle combination: "${plan}" / "${billingCycle}".`);
        }
        const instance = new razorpay_1.default({
            key_id: settings.razorpayKey,
            key_secret: process.env.RAZORPAY_SECRET,
        });
        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: `receipt_hosp_${hospitalId}_${Date.now()}`,
            notes: { hospitalId, plan, billingCycle },
        };
        const order = await instance.orders.create(options);
        return { ...order, razorpayKeyId: settings.razorpayKey, plan, billingCycle, amount };
    }
};
exports.RazorpayService = RazorpayService;
exports.RazorpayService = RazorpayService = RazorpayService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [settings_service_1.SettingsService])
], RazorpayService);
//# sourceMappingURL=razorpay.service.js.map