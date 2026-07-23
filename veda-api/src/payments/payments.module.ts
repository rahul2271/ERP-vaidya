import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { RazorpayService } from './razorpay.service';
import { SettingsModule } from '../settings/settings.module';
import { HospitalsModule } from '../hospitals/hospitals.module';
import { UsersModule } from '../users/users.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [SettingsModule, HospitalsModule, UsersModule, MailModule],
  controllers: [PaymentsController],
  providers: [RazorpayService],
})
export class PaymentsModule {}
