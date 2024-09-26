import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ApplicationModule } from './application/application.module';
import { UserModule } from './user/user.module';
import { TelegramModule } from './telegram/telegram.module';

@Module({
  imports: [AuthModule, ApplicationModule, UserModule, TelegramModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
