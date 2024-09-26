import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { ApplicationService } from './application.service';
import { CreateApplicationDto, GetApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';

@ApiTags('applications')
@ApiBearerAuth('access-token')
@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new application' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'The application has been successfully created.', type: GetApplicationDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  @Auth('admin')
  create(@Body() createApplicationDto: CreateApplicationDto): Promise<GetApplicationDto> {
    return this.applicationService.create(createApplicationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all applications' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return all applications.', type: [GetApplicationDto] })
  findAll(): Promise<GetApplicationDto[]> {
    return this.applicationService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single application by id' })
  @ApiParam({ name: 'id', description: 'Application id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return the application.', type: GetApplicationDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Application not found.' })
  findOne(@Param('id') id: string): Promise<GetApplicationDto> {
    return this.applicationService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an application' })
  @ApiParam({ name: 'id', description: 'Application id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'The application has been successfully updated.', type: GetApplicationDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Application not found.' })
  @Auth('admin')
  update(@Param('id') id: string, @Body() updateApplicationDto: UpdateApplicationDto): Promise<GetApplicationDto> {
    return this.applicationService.update(+id, updateApplicationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an application' })
  @ApiParam({ name: 'id', description: 'Application id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'The application has been successfully deleted.', type: GetApplicationDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Application not found.' })
  remove(@Param('id') id: string): Promise<GetApplicationDto> {
    return this.applicationService.remove(+id);
  }
}