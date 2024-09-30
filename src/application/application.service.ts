import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateApplicationDto } from './dto/create-application.dto'
import { UpdateApplicationDto } from './dto/update-application.dto'
import { Application } from '@prisma/client'

@Injectable()
export class ApplicationService {
	constructor(private prisma: PrismaService) {}

	async create(
		createApplicationDto: CreateApplicationDto
	): Promise<Application> {
		return this.prisma.application.create({
			data: createApplicationDto
		})
	}

	async findAll(): Promise<Application[]> {
		return this.prisma.application.findMany()
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
		return this.prisma.application.update({
			where: { id },
			data: updateApplicationDto
		})
	}

	async remove(id: number): Promise<Application> {
		return this.prisma.application.delete({
			where: { id }
		})
	}
}
