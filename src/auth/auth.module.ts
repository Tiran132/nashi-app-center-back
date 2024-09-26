import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { PrismaModule } from 'src/prisma/prisma.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtStrategy } from 'src/strategies/jwt.strategy'
import { PrismaService } from 'src/prisma/prisma.service'
import { getJWTConfig } from 'src/config/jwt.config'
import { UserService } from 'src/user/user.service'

@Module({
	controllers: [AuthController],
	imports: [
		PrismaModule,
		ConfigModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getJWTConfig
		})
	],
	providers: [AuthService, JwtStrategy, PrismaService, JwtService, UserService]
})
export class AuthModule {}
