import { Controller, Post, Body, UseGuards, Request, Get, Res, Logger, Param, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import * as twilio from 'twilio';
import { Types } from 'mongoose';

@Controller('calls')
export class CallsController {
  private readonly logger = new Logger(CallsController.name);

  constructor(private readonly auditLogsService: AuditLogsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('token')
  async getToken(@Request() req: any) {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_API_KEY || !process.env.TWILIO_API_SECRET) {
      this.logger.error("Twilio credentials missing in Environment Variables!");
      throw new Error("Telephony configuration error");
    }

    const AccessToken = twilio.jwt.AccessToken;
    const VoiceGrant = AccessToken.VoiceGrant;

    const safeIdentity = req.user?.email 
      ? req.user.email.replace(/[^a-zA-Z0-9_]/g, '_')
      : `telecaller_${Math.floor(Math.random() * 10000)}`;

    const token = new AccessToken(
      process.env.TWILIO_ACCOUNT_SID as string,
      process.env.TWILIO_API_KEY as string, 
      process.env.TWILIO_API_SECRET as string,
      { identity: safeIdentity } 
    );

    const grant = new VoiceGrant({
      outgoingApplicationSid: process.env.TWILIO_TWIML_APP_SID as string,
      incomingAllow: true,
    });
    token.addGrant(grant);

    return { token: token.toJwt() };
  }

  @Post('bridge')
  async bridgeCall(@Body() body: any, @Res() res: any) {
    const response = new twilio.twiml.VoiceResponse();
    const targetNumber = body.To;
    
    // 🚀 Catch custom IDs passed from frontend
    const telecallerId = body.telecallerId || '000000000000000000000000';
    const hospitalId = body.hospitalId || '000000000000000000000000';

    if (targetNumber) {
      const dial = response.dial({
        callerId: process.env.TWILIO_PHONE_NUMBER as string,
        record: 'record-from-answer', 
        // 🚀 Pass BOTH IDs to the webhook via query string
        recordingStatusCallback: `https://erpveda.onrender.com/calls/recording-webhook?telecallerId=${telecallerId}&hospitalId=${hospitalId}`,
      });
      dial.number(targetNumber);
    } else {
      response.say("Invalid phone number provided.");
    }
    
    res.type('text/xml');
    res.send(response.toString());
  }

  @Post('recording-webhook')
  async handleRecording(
    @Body() body: any, 
    @Query('telecallerId') telecallerId: string,
    @Query('hospitalId') hospitalId: string
  ) {
    this.logger.log(`New Call Recording Received. SID: ${body.CallSid}`);
    
    // 🛡️ Validate and convert IDs to Mongoose ObjectIds
    const validUserId = Types.ObjectId.isValid(telecallerId) ? telecallerId : '000000000000000000000000';
    const validHospitalId = Types.ObjectId.isValid(hospitalId) ? hospitalId : '000000000000000000000000';
    
    await this.auditLogsService.create({
      hospitalId: new Types.ObjectId(validHospitalId), // 🔒 Secure per hospital
      userId: new Types.ObjectId(validUserId), 
      action: 'CALL_RECORDING',
      module: 'COMMUNICATION',
      targetId: body.To || "Unknown", 
      details: body.RecordingUrl,
    });
    
    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get('history/:phone')
  async getCallHistory(@Param('phone') phone: string, @Request() req: any) {
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
    
    // 🔒 Strictly filter by current hospitalId
    const recordings = await this.auditLogsService.findAll({
      action: 'CALL_RECORDING',
      targetId: formattedPhone,
      hospitalId: req.user.hospitalId 
    });

    return recordings;
  }

  @UseGuards(JwtAuthGuard)
  @Get('recordings/all')
  async getAllHospitalRecordings(@Request() req: any) {
    // 🔒 Admin only sees recordings from their own hospital
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
}