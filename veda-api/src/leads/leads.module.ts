// import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { LeadsService } from './leads.service';
// import { LeadsController } from './leads.controller';
// import { Lead, LeadSchema } from './schemas/lead.schema';

// @Module({
//   // 🚀 FIX: This MUST be inside "imports"
//   imports: [
//     MongooseModule.forFeature([{ name: Lead.name, schema: LeadSchema }])
//   ],
//   controllers: [LeadsController],
//   providers: [LeadsService],
//   exports: [LeadsService], 
  
// })
// export class LeadsModule {}

// import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { LeadsService } from './leads.service';
// import { LeadsController } from './leads.controller';
// import { Lead, LeadSchema } from './schemas/lead.schema';

// @Module({
//   imports: [
//     MongooseModule.forFeature([{ name: Lead.name, schema: LeadSchema }])
//   ],
//   controllers: [LeadsController],
//   providers: [LeadsService],
//   // 🚀 CRITICAL FIX: Export MongooseModule so LeadModel is visible to WhatsAppModule
//   exports: [LeadsService, MongooseModule], 
// })
// export class LeadsModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LeadsService } from './leads.service';
import { LeadsController } from './leads.controller';
import { Lead, LeadSchema } from './schemas/lead.schema';
// 🚀 1. Import the WhatsApp Schema
import { WhatsAppMessage, WhatsAppMessageSchema } from '../whatsapp/schemas/whatsapp-message.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Lead.name, schema: LeadSchema },
      // 🚀 2. Add WhatsApp Schema so LeadsService can count unread messages
      { name: WhatsAppMessage.name, schema: WhatsAppMessageSchema }
    ])
  ],
  controllers: [LeadsController],
  providers: [LeadsService],
  // 🚀 CRITICAL FIX: Export MongooseModule so LeadModel is visible to WhatsAppModule
  exports: [LeadsService, MongooseModule], 
})
export class LeadsModule {}