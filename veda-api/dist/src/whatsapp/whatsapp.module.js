"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsAppModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const whatsapp_controller_1 = require("./whatsapp.controller");
const whatsapp_service_1 = require("./whatsapp.service");
const whatsapp_message_schema_1 = require("./schemas/whatsapp-message.schema");
const hospitals_module_1 = require("../hospitals/hospitals.module");
const leads_module_1 = require("../leads/leads.module");
const settings_module_1 = require("../settings/settings.module");
let WhatsAppModule = class WhatsAppModule {
};
exports.WhatsAppModule = WhatsAppModule;
exports.WhatsAppModule = WhatsAppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            hospitals_module_1.HospitalsModule,
            leads_module_1.LeadsModule,
            settings_module_1.SettingsModule,
            mongoose_1.MongooseModule.forFeature([
                { name: whatsapp_message_schema_1.WhatsAppMessage.name, schema: whatsapp_message_schema_1.WhatsAppMessageSchema }
            ])
        ],
        controllers: [whatsapp_controller_1.WhatsAppController],
        providers: [whatsapp_service_1.WhatsAppService],
        exports: [whatsapp_service_1.WhatsAppService]
    })
], WhatsAppModule);
//# sourceMappingURL=whatsapp.module.js.map