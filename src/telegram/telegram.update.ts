import { Injectable, Logger } from '@nestjs/common';
import { Ctx, InjectBot, Start, Update } from 'nestjs-telegraf';
import { Context, Markup, Telegraf } from 'telegraf';
import { UserService } from '../user/user.service';
import { MixpanelService } from '../mixpanel/mixpanel.service';
import { SceneContext, SceneSession } from 'telegraf/typings/scenes';

@Update()
@Injectable()
export class TelegramUpdate {
	private readonly logger = new Logger(TelegramUpdate.name);
	private fileIdCache: { [key: string]: string } = {};

	constructor(
		@InjectBot() private readonly bot: Telegraf<Context>,
		private readonly userService: UserService,
		private readonly mixpanelService: MixpanelService
	) { }

	@Start()
	async startCommand(
		@Ctx()
		ctx: SceneContext & { session: SceneSession & { messageIndex: number } }
	) {
		const { user, isNew } = await this.userService.findOrCreateUser(
			ctx.from.id,
			ctx.from.username
		)
		await ctx.reply('Приветсвую тебя в нашем боте, тут ты можешь найти полезные для себя сервисы!',
			Markup.inlineKeyboard([
				Markup.button.webApp("Смотреть сервисы", process.env.URL)
			]))

		try {
			this.mixpanelService.track('Bot Start Command', {
				userId: user.id,
				telegramId: ctx.from.id,
				username: ctx.from.username,
				distinct_id: ctx.from.id.toString(),
				firstTime: isNew
			})

			await this.mixpanelService.people.set(ctx.from.id.toString(), {
				$username: ctx.from.username,
				$name: ctx.from.first_name,
				$last_name: ctx.from.last_name,
				$telegram_id: ctx.from.id
			})

			this.logger.log(
				`Tracked start command and set profile for user: ${user.id}`
			)
		} catch (error) {
			this.logger.error(
				`Failed to track start command or set profile: ${error.message}`
			)
		}
	}

	async sendAdvertising(userId: string, text?: string, mediaUrl?: string) {
		try {
			if (mediaUrl) {
				const fileId = this.fileIdCache[mediaUrl];
				let res;

				try {
					if (fileId) {
						this.logger.log(`Attempting to send photo using cached fileId: ${fileId}`);
						// Попытка отправки по file_id
						res = await this.bot.telegram.sendPhoto(userId, fileId, {
							caption: text,
							parse_mode: 'HTML'
						});
						this.logger.log(`Successfully sent photo using cached fileId: ${fileId}`);
					} else {
						this.logger.log(`No cached fileId found. Sending photo using URL: ${mediaUrl}`);
						// Отправка по URL и сохранение file_id
						res = await this.bot.telegram.sendPhoto(userId, mediaUrl, {
							caption: text,
							parse_mode: 'HTML'
						});
						if (res.photo && res.photo.length > 0) {
							const newFileId = res.photo[res.photo.length - 1].file_id;
							this.fileIdCache[mediaUrl] = newFileId;
							this.logger.log(`New fileId cached for URL ${mediaUrl}: ${newFileId}`);
						}
					}
				} catch (photoError) {
					// Если отправка фото не удалась, попробуем отправить как документ
					this.logger.warn(`Failed to send as photo, trying as document: ${photoError.message}`);
					res = await this.bot.telegram.sendDocument(userId, mediaUrl, {
						caption: text,
						parse_mode: 'HTML'
					});
					if (res.document) {
						const docFileId = res.document.file_id;
						this.fileIdCache[mediaUrl] = docFileId;
						this.logger.log(`Sent as document. New fileId cached: ${docFileId}`);
					}
				}
			} else if (text) {
				this.logger.log(`Sending text message to user ${userId}`);
				await this.bot.telegram.sendMessage(userId, text, {
					parse_mode: 'HTML'
				});
			} else {
				throw new Error('No content provided for advertising');
			}
			this.logger.log(`Advertising sent successfully to user ${userId}`);
		} catch (error) {
			this.logger.error(`Failed to send advertising to user ${userId}: ${error.message}`);
			throw error;
		}
	}
}
