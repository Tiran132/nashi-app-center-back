import * as Mixpanel from 'mixpanel';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MixpanelService {
  private mixpanel: Mixpanel.Mixpanel;

  constructor() {
    this.mixpanel = Mixpanel.init(process.env.MIXPANEL_TOKEN);
  }

  track(event: string, properties: any) {
    this.mixpanel.track(event, properties);
  }

  people = {
    set: (userId: string, properties: any) => {
      return new Promise<void>((resolve, reject) => {
        this.mixpanel.people.set(userId, properties, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }
  };
}