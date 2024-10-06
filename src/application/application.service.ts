import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateApplicationDto } from './dto/create-application.dto'
import { UpdateApplicationDto } from './dto/update-application.dto'
import { Application } from '@prisma/client'
import { FileCleanupService } from 'src/file/file-cleanup.service'

@Injectable()
export class ApplicationService {
	constructor(private prisma: PrismaService, private fileCleanupService: FileCleanupService) {}

	async create(
		createApplicationDto: CreateApplicationDto
	): Promise<Application> {
		return this.prisma.application.create({
			data: createApplicationDto
		})
	}

	async findAll(): Promise<Application[]> {
		return this.prisma.application.findMany({
			orderBy: [
				{ orderNumber: 'asc' },
				{ updatedAt: 'asc' }
			]
		})
	}

	async findOne(id: number): Promise<Application | null> {
		return this.prisma.application.findUnique({
			where: { id }
		})
	}

	async update(
		id: number,
		updateApplicationDto: UpdateApplicationDto
	): Promise<Application> {
		return this.prisma.$transaction(async (prisma) => {
			const oldApplication = await prisma.application.findUnique({
				where: { id },
				select: { icon: true, screenshots: true }
			});

			const updatedApplication = await prisma.application.update({
				where: { id },
				data: updateApplicationDto
			});

			if (oldApplication.icon !== updatedApplication.icon || 
				JSON.stringify(oldApplication.screenshots) !== JSON.stringify(updatedApplication.screenshots)) {
				setImmediate(() => this.fileCleanupService.cleanupUnusedFiles('uploads'));
			}

			return updatedApplication;
		});
	}

	async remove(id: number): Promise<Application> {
		return this.prisma.$transaction(async (prisma) => {
			const application = await prisma.application.findUnique({
				where: { id },
				select: { icon: true, screenshots: true }
			});

			if (!application) {
				throw new Error('Application not found');
			}

			const deletedApplication = await prisma.application.delete({
				where: { id }
			});

			setImmediate(() => this.fileCleanupService.cleanupUnusedFiles('uploads'));

			return deletedApplication;
		});
	}

	async updateOrderNumber(id: number, newOrderNumber: number): Promise<Application> {
		return this.prisma.$transaction(async (prisma) => {
			const currentApp = await prisma.application.findUnique({ where: { id } });
			if (!currentApp) {
				throw new Error('Application not found');
			}

			if (newOrderNumber > currentApp.orderNumber) {
				await prisma.application.updateMany({
					where: {
						orderNumber: {
							gt: currentApp.orderNumber,
							lte: newOrderNumber
						}
					},
					data: {
						orderNumber: { decrement: 1 }
					}
				});
			} 
			else if (newOrderNumber < currentApp.orderNumber) {
				await prisma.application.updateMany({
					where: {
						orderNumber: {
							gte: newOrderNumber,
							lt: currentApp.orderNumber
						}
					},
					data: {
						orderNumber: { increment: 1 }
					}
				});
			}

			return prisma.application.update({
				where: { id },
				data: { orderNumber: newOrderNumber }
			});
		});
	}
}
