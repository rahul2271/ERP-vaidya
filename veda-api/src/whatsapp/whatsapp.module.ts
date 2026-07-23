// import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { WhatsAppController } from './whatsapp.controller';
// import { WhatsAppService } from './whatsapp.service';
// import { WhatsAppMessage, WhatsAppMessageSchema } from './schemas/whatsapp-message.schema';
// import { HospitalsModule } from '../hospitals/hospitals.module'; 
// import { LeadsModule } from '../leads/leads.module'; 
// import { SettingsModule } from '../settings/settings.module'; // 🚀 Import SettingsModule

// @Module({
//   imports: [
//     HospitalsModule, 
//     LeadsModule, 
//     SettingsModule, // 🚀 Add it here!
//     MongooseModule.forFeature([
//       { name: WhatsAppMessage.name, schema: WhatsAppMessageSchema }
//     ])
//   ],
//   controllers: [WhatsAppController],
//   providers: [WhatsAppService],
// })
// export class WhatsAppModule {}


import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WhatsAppController } from './whatsapp.controller';
import { WhatsAppService } from './whatsapp.service';
import { WhatsAppMessage, WhatsAppMessageSchema } from './schemas/whatsapp-message.schema';
import { HospitalsModule } from '../hospitals/hospitals.module'; 
import { LeadsModule } from '../leads/leads.module'; 
import { SettingsModule } from '../settings/settings.module'; 

@Module({
  imports: [
    HospitalsModule, 
    LeadsModule, 
    SettingsModule, 
    MongooseModule.forFeature([
      { name: WhatsAppMessage.name, schema: WhatsAppMessageSchema }
    ])
  ],
  controllers: [WhatsAppController],
  providers: [WhatsAppService],
  exports: [WhatsAppService] // 🚀 ADDED: This makes WhatsAppService shareable to other modules!
})
export class WhatsAppModule {}