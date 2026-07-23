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
var CallsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const audit_logs_service_1 = require("../audit-logs/audit-logs.service");
const twilio = __importStar(require("twilio"));
const mongoose_1 = require("mongoose");
let CallsController = CallsController_1 = class CallsController {
    auditLogsService;
    logger = new common_1.Logger(CallsController_1.name);
    constructor(auditLogsService) {
        this.auditLogsService = auditLogsService;
    }
    async getToken(req) {
        if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_API_KEY || !process.env.TWILIO_API_SECRET) {
            this.logger.error("Twilio credentials missing in Environment Variables!");
            throw new Error("Telephony configuration error");
        }
        const AccessToken = twilio.jwt.AccessToken;
        const VoiceGrant = AccessToken.VoiceGrant;
        const safeIdentity = req.user?.email
            ? req.user.email.replace(/[^a-zA-Z0-9_]/g, '_')
            : `telecaller_${Math.floor(Math.random() * 10000)}`;
        const token = new AccessToken(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_API_KEY, process.env.TWILIO_API_SECRET, { identity: safeIdentity });
        const grant = new VoiceGrant({
            outgoingApplicationSid: process.env.TWILIO_TWIML_APP_SID,
            incomingAllow: true,
        });
        token.addGrant(grant);
        return { token: token.toJwt() };
    }
    async bridgeCall(body, res) {
        const response = new twilio.twiml.VoiceResponse();
        const targetNumber = body.To;
        const telecallerId = body.telecallerId || '000000000000000000000000';
        const hospitalId = body.hospitalId || '000000000000000000000000';
        if (targetNumber) {
            const dial = response.dial({
                callerId: process.env.TWILIO_PHONE_NUMBER,
                record: 'record-from-answer',
                recordingStatusCallback: `https://erpveda.onrender.com/calls/recording-webhook?telecallerId=${telecallerId}&hospitalId=${hospitalId}`,
            });
            dial.number(targetNumber);
        }
        else {
            response.say("Invalid phone number provided.");
        }
        res.type('text/xml');
        res.send(response.toString());
    }
    async handleRecording(body, telecallerId, hospitalId) {
        this.logger.log(`New Call Recording Received. SID: ${body.CallSid}`);
        const validUserId = mongoose_1.Types.ObjectId.isValid(telecallerId) ? telecallerId : '000000000000000000000000';
        const validHospitalId = mongoose_1.Types.ObjectId.isValid(hospitalId) ? hospitalId : '000000000000000000000000';
        await this.auditLogsService.create({
            hospitalId: new mongoose_1.Types.ObjectId(validHospitalId),
            userId: new mongoose_1.Types.ObjectId(validUserId),
            action: 'CALL_RECORDING',
            module: 'COMMUNICATION',
            targetId: body.To || "Unknown",
            details: body.RecordingUrl,
        });
        return { success: true };
    }
    async getCallHistory(phone, req) {
        const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
        const recordings = await this.auditLogsService.findAll({
            action: 'CALL_RECORDING',
            targetId: formattedPhone,
            hospitalId: req.user.hospitalId
        });
        return recordings;
    }
    async getAllHospitalRecordings(req) {
        const allRecordings = await this.auditLogsService['auditLogModel']
            .find({
            action: 'CALL_RECORDING',
            hospitalId: req.user.hospitalId
        })
            .populate('userId', 'name email role')
            .sort({ createdAt: -1 })
            .limit(100)
            .exec();
        return allRecordings;
    }
};
exports.CallsController = CallsController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('token'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CallsController.prototype, "getToken", null);
__decorate([
    (0, common_1.Post)('bridge'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CallsController.prototype, "bridgeCall", null);
__decorate([
    (0, common_1.Post)('recording-webhook'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)('telecallerId')),
    __param(2, (0, common_1.Query)('hospitalId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], CallsController.prototype, "handleRecording", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('history/:phone'),
    __param(0, (0, common_1.Param)('phone')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CallsController.prototype, "getCallHistory", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('recordings/all'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CallsController.prototype, "getAllHospitalRecordings", null);
exports.CallsController = CallsController = CallsController_1 = __decorate([
    (0, common_1.Controller)('calls'),
    __metadata("design:paramtypes", [audit_logs_service_1.AuditLogsService])
], CallsController);
//# sourceMappingURL=calls.controller.js.map