"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const crypto = __importStar(require("crypto"));
const razorpay_service_1 = require("./razorpay.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const hospitals_service_1 = require("../hospitals/hospitals.service");
const users_service_1 = require("../users/users.service");
const mail_service_1 = require("../mail/mail.service");
let PaymentsController = class PaymentsController {
    razorpayService;
    hospitalsService;
    usersService;
    mailService;
    constructor(razorpayService, hospitalsService, usersService, mailService) {
        this.razorpayService = razorpayService;
        this.hospitalsService = hospitalsService;
        this.usersService = usersService;
        this.mailService = mailService;
    }
    async startSubscription(body, req) {
        const hospitalId = req.user?.hospitalId;
        if (!hospitalId)
            throw new common_1.BadRequestException('No hospital linked to your account.');
        return this.razorpayService.createOrder(hospitalId, body.plan, body.billingCycle || 'monthly');
    }
    async handleWebhook(body, signature, req) {
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
        if (!webhookSecret) {
            throw new common_1.BadRequestException('Webhook secret not configured on the server.');
        }
        if (!signature) {
            throw new common_1.BadRequestException('Missing signature.');
        }
        const rawBody = req.rawBody;
        if (!rawBody) {
            throw new common_1.BadRequestException('Raw body unavailable for signature verification.');
        }
        const expectedSignature = crypto
            .createHmac('sha256', webhookSecret)
            .update(rawBody)
            .digest('hex');
        if (expectedSignature !== signature) {
            throw new common_1.BadRequestException('Invalid webhook signature.');
        }
        if (body.event === 'payment.captured') {
            const notes = body.payload?.payment?.entity?.notes || {};
            const { hospitalId, plan, billingCycle } = notes;
            const amountPaid = body.payload?.payment?.entity?.amount ? body.payload.payment.entity.amount / 100 : razorpay_service_1.PLAN_PRICING[plan]?.[billingCycle || 'monthly'];
            if (hospitalId && plan) {
                const hospital = await this.hospitalsService.activatePaidPlan(hospitalId, plan, billingCycle || 'monthly');
                try {
                    const admin = await this.usersService.findAdminByHospitalId(hospitalId);
                    if (admin?.email) {
                        await this.mailService.sendSubscriptionReceiptEmail(admin.email, admin.name, hospital.name, plan, amountPaid, hospital.planRenewsAt);
                    }
                }
                catch (error) {
                    console.error('Failed to send subscription receipt email:', error);
                }
            }
        }
        return { status: 'ok' };
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('create-subscription'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "startSubscription", null);
__decorate([
    (0, common_1.Post)('webhook'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('x-razorpay-signature')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "handleWebhook", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, common_1.Controller)('payments'),
    __metadata("design:paramtypes", [razorpay_service_1.RazorpayService,
        hospitals_service_1.HospitalsService,
        users_service_1.UsersService,
        mail_service_1.MailService])
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map