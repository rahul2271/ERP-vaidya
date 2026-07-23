// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { Lead, LeadDocument } from './schemas/lead.schema';

// @Injectable()
// export class LeadsService {
//   constructor(@InjectModel(Lead.name) private leadModel: Model<LeadDocument>) {}

//   // 🚀 1. Admin Bulk Uploads CSV Leads
//   async bulkCreateLeads(leads: any[], hospitalId: string) {
//     const formattedLeads = leads.map(lead => ({
//       ...lead,
//       hospitalId,
//       status: 'NEW'
//     }));
//     return this.leadModel.insertMany(formattedLeads);
//   }

//   // 🚀 2. Admin fetches leads to distribute
//   async getAllLeads(hospitalId: string) {
//     return this.leadModel.find({ hospitalId })
//       .populate('assignedTo', 'name')
//       .sort({ createdAt: -1 })
//       .exec();
//   }

//   // 🚀 3. Admin assigns a lead to a Telecaller
//   async assignLead(leadId: string, telecallerId: string) {
//     return this.leadModel.findByIdAndUpdate(
//       leadId, 
//       { assignedTo: telecallerId, status: 'ASSIGNED' }, 
//       { new: true }
//     );
//   }

//   // 🚀 4. Telecaller fetches their specific assigned leads
//   async getMyLeads(telecallerId: string) {
//     return this.leadModel.find({ assignedTo: telecallerId })
//       .sort({ createdAt: -1 })
//       .exec();
//   }

//   // 🚀 5. Telecaller updates notes after calling
//   async updateLeadStatus(leadId: string, status: string, notes: string) {
//     return this.leadModel.findByIdAndUpdate(
//       leadId,
//       { status, medicalHistoryNotes: notes },
//       { new: true }
//     );
//   }
// }

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Lead, LeadDocument } from './schemas/lead.schema';
// 🚀 Import the WhatsApp Message schema so we can count unread replies
import { WhatsAppMessage } from '../whatsapp/schemas/whatsapp-message.schema'; 

@Injectable()
export class LeadsService {
  constructor(
    @InjectModel(Lead.name) private leadModel: Model<LeadDocument>,
    // 🚀 Inject the WhatsApp model into this service
    @InjectModel(WhatsAppMessage.name) private waModel: Model<WhatsAppMessage> 
  ) {}

  // 🚀 1. Admin Bulk Uploads CSV Leads
  async bulkCreateLeads(leads: any[], hospitalId: string) {
    const formattedLeads = leads.map(lead => ({
      ...lead,
      hospitalId,
      status: 'NEW'
    }));
    return this.leadModel.insertMany(formattedLeads);
  }

  // 🚀 2. Admin fetches leads to distribute
  async getAllLeads(hospitalId: string) {
    return this.leadModel.find({ hospitalId })
      .populate('assignedTo', 'name')
      .sort({ createdAt: -1 })
      .exec();
  }

  // 🚀 3. Admin assigns a lead to a Telecaller
  async assignLead(leadId: string, telecallerId: string) {
    return this.leadModel.findByIdAndUpdate(
      leadId, 
      { assignedTo: telecallerId, status: 'ASSIGNED' }, 
      { new: true }
    );
  }

  // 🚀 4. Telecaller fetches their specific assigned leads
  async getMyLeads(telecallerId: string) {
    // 1. Fetch the leads as plain JavaScript objects using .lean() so we can modify them
    const leads = await this.leadModel.find({ assignedTo: telecallerId })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    // 2. Loop through each lead and count their unread patient replies
    const leadsWithUnreadCounts = await Promise.all(
      leads.map(async (lead) => {
        const unreadCount = await this.waModel.countDocuments({
          leadId: lead._id.toString(), // Match the lead ID
          sender: 'PATIENT',           // Only count messages from the patient
          isRead: false                // Only count unread messages
        }).exec();

        // 3. Attach the unread count to the lead object before sending to the frontend
        return {
          ...lead,
          unreadCount
        };
      })
    );

    return leadsWithUnreadCounts;
  }

  // 🚀 5. Telecaller updates notes after calling
  async updateLeadStatus(leadId: string, status: string, notes: string) {
    return this.leadModel.findByIdAndUpdate(
      leadId,
      { status, medicalHistoryNotes: notes },
      { new: true }
    );
  }
}