import { Injectable, Logger } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { UserService } from '../user/user.service';
import { TelegramUpdate } from '../telegram/telegram.update';

@Injectable()
export class AdvertisingService {
  private readonly logger = new Logger(AdvertisingService.name);
  private readonly QUEUE_KEY = 'advertising_queue';
  private readonly PROCESSING_SET = 'processing_set';
  private readonly MAX_CONCURRENT = 8;

  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly userService: UserService,
    private readonly telegramUpdate: TelegramUpdate,
  ) {}

  async queueAdvertising(text: string, imageUrl: string): Promise<void> {
    const message = JSON.stringify({ text, imageUrl });
    await this.redis.rpush(this.QUEUE_KEY, message);
    this.processQueue();
  }

  private async processQueue(): Promise<void> {
    const processing = await this.redis.scard(this.PROCESSING_SET);
    const available = this.MAX_CONCURRENT - processing;

    if (available <= 0) {
      return;
    }

    for (let i = 0; i < available; i++) {
      const message = await this.redis.lpop(this.QUEUE_KEY);
      if (!message) {
        break;
      }

      const { text, imageUrl } = JSON.parse(message);
      this.sendAdvertising(text, imageUrl);
    }
  }

  private async sendAdvertising(text: string, imageUrl: string): Promise<void> {
    const users = await this.userService.getAllUsers();
    const userIds = users.map(user => user.telegramId);

    await this.redis.sadd(this.PROCESSING_SET, ...userIds);

    for (const userId of userIds) {
      try {
        await this.telegramUpdate.sendAdvertising(userId, text, imageUrl);
        await this.redis.srem(this.PROCESSING_SET, userId);
      } catch (error) {
        this.logger.error(`Failed to send advertising to user ${userId}: ${error.message}`);
        await this.redis.srem(this.PROCESSING_SET, userId);
      }
    }

    this.processQueue();
  }
}
