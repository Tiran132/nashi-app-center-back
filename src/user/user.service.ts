import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class UserService {
	constructor(private readonly prisma: PrismaService) {}
	async findOrCreateUser(telegramId: number, username?: string) {
		let isNew = false
		let user = await this.prisma.user.findUnique({
			where: {
				telegramId: telegramId.toString()
			}
		})

		if (!user) {
			isNew = true
			user = await this.prisma.user.create({
				data: {
					telegramId: telegramId.toString(),
					username: username || undefined
				}
			})
		}
		return {user, isNew}
	}

	async getUserById(userId: number) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId
			}
		})

		return user
	}

	async getAllUsers() {
		return this.prisma.user.findMany()
	}

	async setUserIsAdmin(userId: number, isAdmin: boolean) {
		return this.prisma.user.update({where: {id: userId}, data: {isAdmin}})
	}
}
