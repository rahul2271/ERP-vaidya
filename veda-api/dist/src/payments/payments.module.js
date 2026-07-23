"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsModule = void 0;
const common_1 = require("@nestjs/common");
const payments_controller_1 = require("./payments.controller");
const razorpay_service_1 = require("./razorpay.service");
const settings_module_1 = require("../settings/settings.module");
const hospitals_module_1 = require("../hospitals/hospitals.module");
const users_module_1 = require("../users/users.module");
const mail_module_1 = require("../mail/mail.module");
let PaymentsModule = class PaymentsModule {
};
exports.PaymentsModule = PaymentsModule;
exports.PaymentsModule = PaymentsModule = __decorate([
    (0, common_1.Module)({
        imports: [settings_module_1.SettingsModule, hospitals_module_1.HospitalsModule, users_module_1.UsersModule, mail_module_1.MailModule],
        controllers: [payments_controller_1.PaymentsController],
        providers: [razorpay_service_1.RazorpayService],
    })
], PaymentsModule);
//# sourceMappingURL=payments.module.js.map