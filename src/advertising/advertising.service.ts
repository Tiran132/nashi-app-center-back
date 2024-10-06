import { Injectable, Logger } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { TelegramUpdate } from '../telegram/telegram.update'

@Injectable()
export class AdvertisingService {
	private readonly logger = new Logger(AdvertisingService.name)
	private readonly MAX_BATCH_SIZE = 8

	constructor(
		private readonly userService: UserService,
		private readonly telegramUpdate: TelegramUpdate
	) {}

	async sendAdvertising(
		text?: string,
		mediaUrl?: string,
		batchSize: number = this.MAX_BATCH_SIZE
	): Promise<void> {
		const users = await this.userService.getAllUsers()
		const totalUsers = users.length
		let processedUsers = 0

		while (processedUsers < totalUsers) {
			const batch = users.slice(processedUsers, processedUsers + batchSize)

			for (const user of batch) {
				try {
					await this.telegramUpdate.sendAdvertising(
						user.telegramId,
						text,
						mediaUrl
					)
					this.logger.log(`Advertising sent to user ${user.telegramId}`)
				} catch (error) {
					this.logger.error(
						`Failed to send advertising to user ${user.telegramId}: ${error.message}`
					)
				}
			}

			processedUsers += batch.length

			await new Promise(resolve => setTimeout(resolve, 400))
		}

		this.logger.log(
			`Advertising campaign completed. Processed ${processedUsers} users.`
		)
	}
}
