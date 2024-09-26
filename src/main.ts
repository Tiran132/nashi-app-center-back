import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
	
	const app = await NestFactory.create(AppModule)
	const config = new DocumentBuilder()
		.setTitle('Your API Title')
		.setDescription('Your API Description')
		.setVersion('1.0')
		.addBearerAuth(
			{ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
			'access-token'
		)
		.build()
	const document = SwaggerModule.createDocument(app, config)
	SwaggerModule.setup('api', app, document)

	app.enableCors({
		origin: '*',
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
		credentials: true
	})
	await app.listen(3953)
}
bootstrap()
