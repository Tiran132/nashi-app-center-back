import { ApiProperty } from '@nestjs/swagger'
import {
	IsString,
	IsArray,
	IsOptional,
	IsInt,
	Min,
	IsDate
} from 'class-validator'

export class CreateApplicationDto {
	@ApiProperty({ description: 'The name of the application' })
	@IsString()
	name: string

	@ApiProperty({ description: 'The description of the application' })
	@IsString()
	description: string

	@ApiProperty({ description: 'The icon URL of the application' })
	@IsString()
	icon: string

	@ApiProperty({ description: 'An array of screenshot URLs', type: [String] })
	@IsArray()
	@IsString({ each: true })
	screenshots: string[]

	@ApiProperty({ description: 'The category of the application' })
	@IsString()
	category: string

	@ApiProperty({
		description: 'The order number of the application (optional)',
		required: false
	})
	@IsOptional()
	@IsInt()
	@Min(0)
	orderNumber?: number

	@ApiProperty({ description: 'The shortdescription of the application' })
	@IsString()
	@IsOptional()
	shortDescription?: string

	@ApiProperty({ description: 'The url of the application' })
	@IsString()
	url: string
}

export class GetApplicationDto {
	@ApiProperty({ description: 'The ID of the application' })
	@IsInt()
	id: number

	@ApiProperty({ description: 'The name of the application' })
	@IsString()
	name: string

	@ApiProperty({ description: 'The description of the application' })
	@IsString()
	description: string
	@ApiProperty({ description: 'The shortdescription of the application' })
	@IsString()
	@IsOptional()
	shortDescription?: string

	@ApiProperty({ description: 'The icon URL of the application' })
	@IsString()
	icon: string

	@ApiProperty({ description: 'An array of screenshot URLs', type: [String] })
	@IsArray()
	@IsString({ each: true })
	screenshots: string[]

	@ApiProperty({ description: 'The category of the application' })
	@IsString()
	category: string

	@ApiProperty({ description: 'The order number of the application' })
	@IsInt()
	orderNumber: number | null

	@ApiProperty({ description: 'The creation date of the application' })
	@IsDate()
	createdAt: Date

	@ApiProperty({ description: 'The last update date of the application' })
	@IsDate()
	updatedAt: Date

	@ApiProperty({ description: 'The url of the application' })
	@IsString()
	url: string
}
