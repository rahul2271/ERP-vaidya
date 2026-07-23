import { Controller, Get, Post, Body, Query, HttpCode, HttpStatus, Param, UseGuards, Request, UseInterceptors, UploadedFile, BadRequestException, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'; 
import { WhatsAppService } from './whatsapp.service';
import { SettingsService } from '../settings/settings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; 
import { Public } from '../auth/public.decorator'; // 🚀 Import this

@Controller('whatsapp')
export class WhatsAppController {
  constructor(
    private readonly whatsappService: WhatsAppService,
    private readonly settingsService: SettingsService
  ) {}

  // ==================================================
  // 🚀 PUBLIC WEBHOOKS (MUST BE AT THE VERY TOP!)
  // ==================================================

  @Public() // 🚀 THIS IS THE MASTER KEY
  @Get('webhook')
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
    @Res() res: any // 🚀 Using 'any' bypasses strict TS decorator errors
  ) {
    const serverToken = 'veda_erp_secure_token_123';

    if (mode === 'subscribe' && token === serverToken) {
      console.log('✅ WEBHOOK_VERIFIED');
      // Use the raw response object to send exactly what Meta wants
      return res.status(200).send(challenge); 
    }
    
    console.error('❌ WEBHOOK_VERIFICATION_FAILED');
    return res.status(403).send('Verification failed');
  }

  @Public() // 🚀 THIS IS THE MASTER KEY
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(@Body() body: any) {
    return this.whatsappService.handleIncoming(body);
  }

  // ==================================================
  // 🔒 PROTECTED ROUTES (MUST BE BELOW WEBHOOKS)
  // ==================================================

  @UseGuards(JwtAuthGuard)
  @Post('send')
  async sendMessage(
    @Body() body: { leadId: string; phone: string; text: string },
    @Request() req
  ) {
    const hospitalId = req.user.hospitalId; // Extracted from JWT
    return this.whatsappService.logAndSendMessage(
      hospitalId,
      body.leadId, 
      body.phone, 
      body.text, 
      'ERP' 
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('send-media')
  @UseInterceptors(FileInterceptor('file'))
  async sendMediaMessage(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { leadId: string; phone: string; text?: string },
    @Request() req
  ) {
    if (!file) throw new BadRequestException('No file uploaded');
    const hospitalId = req.user.hospitalId; // Extracted from JWT

    return this.whatsappService.logAndSendMedia(
      hospitalId,
      body.leadId,
      body.phone,
      file,
      body.text || '', 
      'ERP'
    );
  }

  // ⚠️ THIS CATCH-ALL MUST BE THE ABSOLUTE LAST GET ROUTE
  @UseGuards(JwtAuthGuard)
  @Get(':leadId') 
  async getChatHistory(@Param('leadId') leadId: string) {
    return this.whatsappService.getHistory(leadId);
  }
}