import { Controller, Post, Body } from '@nestjs/common'
import { AdvertisingService } from './advertising.service'
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger'
import { Auth } from '../auth/decorators/auth.decorator'

@ApiTags('advertising')
@Controller('advertising')
export class AdvertisingController {
	constructor(private readonly advertisingService: AdvertisingService) {}

	@Post('broadcast')
	// @Auth('admin')
	@ApiBody({
		type: Object,
		examples: {
			example1: {
				summary: 'Example 1',
				value: {
					text: 'Привет, это реклама',
					imageUrl: 'https://example.com/image.jpg',
					batchSize: 5
				}
			}
		},
		schema: {
			properties: {
				text: { type: 'string', example: 'Привет, это реклама' },
				imageUrl: { type: 'string', example: 'https://example.com/image.jpg' },
				batchSize: { type: 'number', example: 5 }
			}
		}
	})
	@ApiOperation({ summary: 'Send advertising broadcast' })
	@ApiResponse({ status: 200, description: 'Advertising sent successfully' })
	async sendAdvertising(@Body() body: { text?: string; imageUrl?: string; batchSize?: number }) {
		await this.advertisingService.sendAdvertising(body.text, body.imageUrl, body.batchSize);
		return { message: 'Advertising broadcast initiated' };
	}
}
