import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import * as fs from 'fs'
import * as path from 'path'

@Injectable()
export class FileCleanupService {
	private readonly logger = new Logger(FileCleanupService.name)

	constructor(private prisma: PrismaService) {}

	async cleanupUnusedFiles(directory: string): Promise<void> {
		try {
			const usedFilePaths = await this.getUsedFilePaths()

			const allFiles = await this.getAllFiles(directory)

			const unusedFiles = allFiles.filter(file => !usedFilePaths.includes(file))

			for (const file of unusedFiles) {
				await fs.promises.unlink(file)
				this.logger.log(`Deleted unused file: ${file}`)
			}

			this.logger.log(
				`Cleanup completed. Deleted ${unusedFiles.length} unused files.`
			)
		} catch (error) {
			this.logger.error(
				`Error cleaning up files: ${error.message}`,
				error.stack
			)
			throw error
		}
	}

	private async getUsedFilePaths(): Promise<string[]> {
		const applications = await this.prisma.application.findMany({
			select: {
				icon: true,
				screenshots: true
			}
		})

		const usedPaths = new Set<string>()

		applications.forEach(app => {
			usedPaths.add(app.icon)
			app.screenshots.forEach(screenshot => usedPaths.add(screenshot))
		})

		return Array.from(usedPaths)
	}

	private async getAllFiles(directory: string): Promise<string[]> {
		const files: string[] = []

		async function traverse(dir: string) {
			const entries = await fs.promises.readdir(dir, { withFileTypes: true })

			for (const entry of entries) {
				const fullPath = path.join(dir, entry.name)
				if (entry.isDirectory()) {
					await traverse(fullPath)
				} else {
					files.push(fullPath)
				}
			}
		}

		await traverse(directory)
		return files
	}
}
