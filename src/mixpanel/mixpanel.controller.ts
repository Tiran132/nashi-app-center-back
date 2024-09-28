import { Controller } from '@nestjs/common';
import { MixpanelService } from './mixpanel.service';

@Controller('mixpanel')
export class MixpanelController {
  constructor(private readonly mixpanelService: MixpanelService) {}
}
