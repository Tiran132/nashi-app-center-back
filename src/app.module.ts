import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ApplicationModule } from './application/application.module';
import { UserModule } from './user/user.module';
import { TelegramModule } from './telegram/telegram.module';
import { MixpanelModule } from './mixpanel/mixpanel.module';
import { MixpanelService } from './mixpanel/mixpanel.service';
import { ConfigModule } from '@nestjs/config';
import { FileModule } from './file/file.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule, ApplicationModule, UserModule, TelegramModule, MixpanelModule, FileModule
  ],
  providers: [MixpanelService],
})
export class AppModule {}
