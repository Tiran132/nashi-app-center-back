import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ApplicationModule } from './application/application.module';
import { UserModule } from './user/user.module';
import { TelegramModule } from './telegram/telegram.module';
import { MixpanelModule } from './mixpanel/mixpanel.module';
import { MixpanelService } from './mixpanel/mixpanel.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule, ApplicationModule, UserModule, TelegramModule, MixpanelModule
  ],
  providers: [MixpanelService],
})
export class AppModule {}
