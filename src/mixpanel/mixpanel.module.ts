import { Module } from '@nestjs/common';
import { MixpanelService } from './mixpanel.service';
import { MixpanelController } from './mixpanel.controller';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [MixpanelController],
  providers: [MixpanelService, ConfigService],
  exports: [MixpanelService],
})
export class MixpanelModule {}
