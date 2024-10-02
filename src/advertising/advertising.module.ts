import { Module } from '@nestjs/common';
import { AdvertisingService } from './advertising.service';
import { AdvertisingController } from './advertising.controller';
import { TelegramModule } from 'src/telegram/telegram.module';
import { UserModule } from 'src/user/user.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [UserModule, TelegramModule],
  controllers: [AdvertisingController],
  providers: [AdvertisingService, PrismaService],
})
export class AdvertisingModule {}
