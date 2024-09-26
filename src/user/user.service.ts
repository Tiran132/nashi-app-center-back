import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class UserService {
	constructor(private readonly prisma: PrismaService) {}
	async findOrCreateUser(telegramId: number, username?: string) {
		let user = await this.prisma.user.findUnique({
			where: {
				telegramId: telegramId.toString()
			}
		})

		if (!user) {
			user = await this.prisma.user.create({
				data: {
					telegramId: telegramId.toString(),
					username: username || undefined
				}
			})
		}
		return user
	}

	async getUserById(userId: number) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId
			}
		})

		return user
	}
}
