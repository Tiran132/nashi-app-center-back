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

			const unusedFiles = allFiles.filter(
				file =>
					!usedFilePaths.some(
						usedPath => this.normalizeFilePath(file) === this.normalizeFilePath(usedPath)
					)
			)

			this.logger.debug(`Used file paths: ${JSON.stringify(usedFilePaths)}`)
			this.logger.debug(`All files: ${JSON.stringify(allFiles)}`)
			this.logger.debug(`Unused files: ${JSON.stringify(unusedFiles)}`)

			for (const file of unusedFiles) {
				const fullPath = path.join(directory, file)
				await fs.promises.unlink(fullPath)
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
			if (app.icon && typeof app.icon === 'string') {
				usedPaths.add(this.normalizeFilePath(app.icon))
			}
			app.screenshots.forEach(screenshot => {
				if (screenshot && typeof screenshot === 'string') {
					usedPaths.add(this.normalizeFilePath(screenshot))
				}
			})
		})

		return Array.from(usedPaths)
	}

	private async getAllFiles(directory: string): Promise<string[]> {
		const files: string[] = []

		async function traverse(dir: string) {
			const entries = await fs.promises.readdir(dir, { withFileTypes: true })

			for (const entry of entries) {
				const relativePath = path.join(dir, entry.name).replace(directory, '').replace(/^[/\\]/, '')
				if (entry.isDirectory()) {
					await traverse(path.join(dir, entry.name))
				} else {
					files.push(relativePath)
				}
			}
		}

		await traverse(directory)
		return files.map(file => this.normalizeFilePath(file))
	}

	private normalizeFilePath(filePath: string): string {
		// Извлекаем путь после 'uploads/'
		const match = filePath.match(/(?:uploads\/)(.*)/);
		if (match) {
			return match[1].replace(/\\/g, '/').toLowerCase();
		}
		// Если 'uploads/' не найден, просто нормализуем путь
		return filePath.replace(/\\/g, '/').replace(/^\//, '').toLowerCase();
	}
}
