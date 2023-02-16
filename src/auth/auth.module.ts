import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { TypegooseModule } from 'nestjs-typegoose'
import { UserModel } from '../user/user.model/user.model'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './strategy/jwt.strategy'
import { AuthService } from './auth.service'
import { getJWTConfig } from '../config/jwt.config'

@Module({
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy],
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: UserModel,
				schemaOptions: {
					collection: 'User',
				},
			},
		]),
		ConfigModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getJWTConfig,
		}),
	],
})
export class AuthModule {}
