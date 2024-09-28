import { Ctx, InjectBot, Start, Update } from 'nestjs-telegraf'
import { UserService } from 'src/user/user.service'
import { Context, Telegraf } from 'telegraf'
import { SceneContext, SceneSession } from 'telegraf/typings/scenes'
import { MixpanelService } from 'src/mixpanel/mixpanel.service'
import { Logger } from '@nestjs/common'

@Update()
export class TelegramUpdate {
	private readonly logger = new Logger(TelegramUpdate.name)

	constructor(
		@InjectBot() private readonly bot: Telegraf<Context>,
		private readonly userService: UserService,
		private readonly mixpanelService: MixpanelService,
	) {}

	@Start()
	async startCommand(
		@Ctx()
		ctx: SceneContext & { session: SceneSession & { messageIndex: number } }
	) {
		const user = await this.userService.findOrCreateUser(ctx.from.id, ctx.from.username)
		await ctx.reply('Welcome to the bot!')

		try {
			this.mixpanelService.track('Bot Start Command', {
				userId: user.id,
				telegramId: ctx.from.id,
				username: ctx.from.username,
				distinct_id: ctx.from.id
			})
			this.logger.log(`Tracked start command for user: ${user.id}`)
		} catch (error) {
			this.logger.error(`Failed to track start command: ${error.message}`)
		}
	}
}
