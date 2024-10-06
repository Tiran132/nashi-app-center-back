import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
// import { RedisModule } from '@nestjs-modules/ioredis'
import { AuthModule } from './auth/auth.module'
import { ApplicationModule } from './application/application.module'
import { UserModule } from './user/user.module'
import { TelegramModule } from './telegram/telegram.module'
import { MixpanelModule } from './mixpanel/mixpanel.module'
import { MixpanelService } from './mixpanel/mixpanel.service'
import { FileModule } from './file/file.module'
import { AdvertisingModule } from './advertising/advertising.module'

@Module({
	imports: [
		ConfigModule.forRoot(),
		// RedisModule.forRootAsync({
		// 	imports: [ConfigModule],
		// 	useFactory: (configService: ConfigService) => ({
		// 		type: 'single',
		// 		url: configService.get('REDIS_URL')
		// 	}),
		// 	inject: [ConfigService]
		// }),
		AuthModule,
		ApplicationModule,
		UserModule,
		TelegramModule,
		MixpanelModule,
		FileModule,
		AdvertisingModule
	],
	providers: [MixpanelService]
})
export class AppModule {}
