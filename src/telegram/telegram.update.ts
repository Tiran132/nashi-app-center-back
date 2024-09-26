import { Ctx, InjectBot, Start, Update } from 'nestjs-telegraf'
import { UserService } from 'src/user/user.service'
import { Context, Telegraf } from 'telegraf'
import { SceneContext, SceneSession } from 'telegraf/typings/scenes'

@Update()
export class TelegramUpdate {
	constructor(
		@InjectBot() private readonly bot: Telegraf<Context>,
		private readonly userService: UserService,
	) {}

	@Start()
	async startCommand(
		@Ctx()
		ctx: SceneContext & { session: SceneSession & { messageIndex: number } }
	) {
		await this.userService.findOrCreateUser(ctx.from.id, ctx.from.username)
		await ctx.reply('Welcome to the bot!')
	}
}
