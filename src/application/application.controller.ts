import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	HttpStatus,
	ParseIntPipe
} from '@nestjs/common'
import {
	ApiTags,
	ApiOperation,
	ApiResponse,
	ApiParam,
	ApiBearerAuth,
	ApiBody
} from '@nestjs/swagger'
import { ApplicationService } from './application.service'
import {
	CreateApplicationDto,
	GetApplicationDto
} from './dto/create-application.dto'
import { UpdateApplicationDto } from './dto/update-application.dto'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { Application } from '@prisma/client'

@ApiTags('applications')
@ApiBearerAuth('access-token')
@Controller('applications')
export class ApplicationController {
	constructor(private readonly applicationService: ApplicationService) {}

	@Post()
	@ApiOperation({ summary: 'Create a new application' })
	@ApiResponse({
		status: HttpStatus.CREATED,
		description: 'The application has been successfully created.',
		type: GetApplicationDto
	})
	@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
	@Auth('admin')
	create(
		@Body() createApplicationDto: CreateApplicationDto
	): Promise<Application> {
		return this.applicationService.create(createApplicationDto)
	}

	@Get()
	@ApiOperation({ summary: 'Get all applications' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Return all applications.',
		type: [GetApplicationDto]
	})
	findAll(): Promise<Application[]> {
		return this.applicationService.findAll()
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get a single application by id' })
	@ApiParam({ name: 'id', description: 'Application id' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Return the application.',
		type: GetApplicationDto
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Application not found.'
	})
	findOne(@Param('id') id: string): Promise<Application> {
		return this.applicationService.findOne(+id)
	}

	@Patch(':id')
	@ApiOperation({ summary: 'Update an application' })
	@ApiParam({ name: 'id', description: 'Application id' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'The application has been successfully updated.',
		type: GetApplicationDto
	})
	@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Application not found.'
	})
	@Auth('admin')
	update(
		@Param('id') id: string,
		@Body() updateApplicationDto: UpdateApplicationDto
	): Promise<Application> {
		return this.applicationService.update(+id, updateApplicationDto)
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Delete an application' })
	@ApiParam({ name: 'id', description: 'Application id' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'The application has been successfully deleted.',
		type: GetApplicationDto
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Application not found.'
	})
	@Auth('admin')
	remove(@Param('id') id: string): Promise<Application> {
		return this.applicationService.remove(+id)
	}

	@Patch(':id/order')
	@ApiOperation({ summary: 'Update the order number of an application' })
	@ApiParam({ name: 'id', description: 'Application id' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'The application order number has been successfully updated.',
		type: GetApplicationDto
	})
	@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Application not found.'
	})
	@Auth('admin')
	@ApiBody({
		description: 'New order number for the application',
		schema: { properties: { orderNumber: { type: 'integer', example: 1 } } }
	})
	async updateOrderNumber(
		@Param('id', ParseIntPipe) id: number,
		@Body('orderNumber', ParseIntPipe) orderNumber: number
	): Promise<Application> {
		return this.applicationService.updateOrderNumber(id, orderNumber)
	}
}
