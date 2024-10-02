import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { TelegramUpdate } from './telegram.update';
import { UserService } from 'src/user/user.service';
import { Agent } from 'https';
import { PrismaService } from 'src/prisma/prisma.service';
import { MixpanelService } from 'src/mixpanel/mixpanel.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TelegrafModule.forRoot({
      token: process.env.BOT_TOKEN,
      options: {
        telegram: {
          agent: new Agent({ keepAlive: false })
        }
      }
    })
  ],
  providers: [
    TelegramUpdate,
    UserService,
    PrismaService,
    MixpanelService,
    ConfigService
  ],
  exports: [TelegramUpdate]
})
export class TelegramModule {}
