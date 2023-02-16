import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { UserModel } from '../../user/user.model/user.model'
import { InjectModel } from 'nestjs-typegoose'
import { Injectable } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly configService: ConfigService,
		@InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get('JWT_SECRET'),
		})
	}

	async validate({ _id }: Pick<UserModel, '_id'>) {
		return this.UserModel.findById(_id).exec()
	}
}
