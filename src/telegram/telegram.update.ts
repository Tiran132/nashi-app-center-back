import { Ctx, InjectBot, Start, Update } from 'nestjs-telegraf'
import { UserService } from 'src/user/user.service'
import { Context, Markup, Telegraf } from 'telegraf'
import { SceneContext, SceneSession } from 'telegraf/typings/scenes'
import { MixpanelService } from 'src/mixpanel/mixpanel.service'
import { Logger } from '@nestjs/common'

@Update()
export class TelegramUpdate {
	private readonly logger = new Logger(TelegramUpdate.name)

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

	async sendAdvertising(userId: string, text: string, imageUrl: string) {
		await this.bot.telegram.sendPhoto(
			userId,
			imageUrl,
			{
				caption: text,
				parse_mode: 'HTML'
			}
		)
	}
}
