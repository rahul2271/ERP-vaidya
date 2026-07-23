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
exports.LeadsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const lead_schema_1 = require("./schemas/lead.schema");
const whatsapp_message_schema_1 = require("../whatsapp/schemas/whatsapp-message.schema");
let LeadsService = class LeadsService {
    leadModel;
    waModel;
    constructor(leadModel, waModel) {
        this.leadModel = leadModel;
        this.waModel = waModel;
    }
    async bulkCreateLeads(leads, hospitalId) {
        const formattedLeads = leads.map(lead => ({
            ...lead,
            hospitalId,
            status: 'NEW'
        }));
        return this.leadModel.insertMany(formattedLeads);
    }
    async getAllLeads(hospitalId) {
        return this.leadModel.find({ hospitalId })
            .populate('assignedTo', 'name')
            .sort({ createdAt: -1 })
            .exec();
    }
    async assignLead(leadId, telecallerId) {
        return this.leadModel.findByIdAndUpdate(leadId, { assignedTo: telecallerId, status: 'ASSIGNED' }, { new: true });
    }
    async getMyLeads(telecallerId) {
        const leads = await this.leadModel.find({ assignedTo: telecallerId })
            .sort({ createdAt: -1 })
            .lean()
            .exec();
        const leadsWithUnreadCounts = await Promise.all(leads.map(async (lead) => {
            const unreadCount = await this.waModel.countDocuments({
                leadId: lead._id.toString(),
                sender: 'PATIENT',
                isRead: false
            }).exec();
            return {
                ...lead,
                unreadCount
            };
        }));
        return leadsWithUnreadCounts;
    }
    async updateLeadStatus(leadId, status, notes) {
        return this.leadModel.findByIdAndUpdate(leadId, { status, medicalHistoryNotes: notes }, { new: true });
    }
};
exports.LeadsService = LeadsService;
exports.LeadsService = LeadsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(lead_schema_1.Lead.name)),
    __param(1, (0, mongoose_1.InjectModel)(whatsapp_message_schema_1.WhatsAppMessage.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], LeadsService);
//# sourceMappingURL=leads.service.js.map