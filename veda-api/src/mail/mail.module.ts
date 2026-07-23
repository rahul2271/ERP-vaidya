import { Module, forwardRef } from '@nestjs/common'; // 🚀 Import forwardRef
import { MailService } from './mail.service';
import { SettingsModule } from '../settings/settings.module';

@Module({
  imports: [
    forwardRef(() => SettingsModule), // 🚀 Use forwardRef here
  ],
  providers: [MailService],
  exports: [MailService], 
})
export class MailModule {}