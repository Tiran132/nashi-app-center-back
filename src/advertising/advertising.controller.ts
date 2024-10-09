import { Controller, Post, Body } from '@nestjs/common'
import { AdvertisingService } from './advertising.service'
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger'
import { Auth } from '../auth/decorators/auth.decorator'

@ApiTags('advertising')
@Controller('advertising')
@ApiBearerAuth('access-token')
export class AdvertisingController {
	constructor(private readonly advertisingService: AdvertisingService) {}

	@Post('broadcast')
	@Auth('admin')
	@ApiBody({
		type: Object,
		examples: {
			example1: {
				summary: 'Example 1',
				value: {
					text: 'Привет, это реклама',
					imageUrl: 'https://example.com/image.jpg'
				}
			}
		},
		schema: {
			properties: {
				text: { type: 'string', example: 'Привет, это реклама' },
				imageUrl: { type: 'string', example: 'https://example.com/image.jpg' }
			}
		}
	})
	@ApiOperation({ summary: 'Queue advertising broadcast' })
	@ApiResponse({ status: 200, description: 'Advertising queued successfully' })
	async queueAdvertising(@Body() body: { text: string; imageUrl: string }) {
		await this.advertisingService.queueAdvertising(body.text, body.imageUrl)
		return { message: 'Advertising queued for broadcast' }
	}
}
