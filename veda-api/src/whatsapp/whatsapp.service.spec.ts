// import { Test, TestingModule } from '@nestjs/testing';
// import { WhatsappService } from './whatsapp.service';

// describe('WhatsappService', () => {
//   let service: WhatsappService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [WhatsappService],
//     }).compile();

//     service = module.get<WhatsappService>(WhatsappService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });
// });


import { Test, TestingModule } from '@nestjs/testing';
import { WhatsAppService } from './whatsapp.service';
import { getModelToken } from '@nestjs/mongoose';
import { WhatsAppMessage } from './schemas/whatsapp-message.schema';

describe('WhatsAppService', () => {
  let service: WhatsAppService;

  // 🚀 1. Create a fake Mongoose Model so we don't hit the real database
  const mockWhatsAppModel = {
    save: jest.fn().mockResolvedValue({ _id: 'mockId123', status: 'SENT' }),
    find: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue([]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WhatsAppService,
        // 🚀 2. Inject the fake model into the testing module
        {
          provide: getModelToken(WhatsAppMessage.name),
          useValue: mockWhatsAppModel, // Provide the mock here
        },
      ],
    }).compile();

    service = module.get<WhatsAppService>(WhatsAppService);
  });

  it('should be defined', () => {
    // 🚀 3. This will now pass!
    expect(service).toBeDefined();
  });
});