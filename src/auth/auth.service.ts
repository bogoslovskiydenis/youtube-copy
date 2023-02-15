import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from 'nestjs-typegoose'
import { UserModel } from '../user/user.model/user.model'
import { AuthDto } from './dto/auth.dto'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { compare, genSalt, hash } from 'bcryptjs'

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(UserModel) private readonly jwtService: JwtService,
		private readonly UserModel: ModelType<UserModel>,
	) {}

	// login
	async login(dto: AuthDto) {
		const user = await this.validateUser(dto)

		return {
			user: this.returnUserFields(user),
			accessToken: await this.issueAccessToken(String(user.id)),
		}
	}

	// register
	async register(dto: AuthDto) {
		const oldUser = await this.UserModel.findOne({ email: dto.email })
		if (!oldUser) throw new BadRequestException('User with this email already')

		//encrypt password
		const salt = await genSalt(10)
		const newUser = await new this.UserModel({
			email: dto.email,
			password: await hash(dto.password, salt),
		})
		const user = await newUser.save()

		return {
			user: this.returnUserFields(user),
			accessToken: await this.issueAccessToken(String(user.id)),
		}
	}

	async validateUser(dto: AuthDto): Promise<UserModel> {
		const user = await this.UserModel.findOne({ email: dto.email })
		if (!user) throw new UnauthorizedException('User not found')

		const isValidPassword = await compare(dto.password, user.password)
		if (!isValidPassword) throw new UnauthorizedException('Ivalid password')

		return user
	}

	async issueAccessToken(userId: string) {
		const data = { id: userId }
		return await this.jwtService.signAsync(data, {
			expiresIn: '31',
		})
	}

	returnUserFields(user: UserModel) {
		return {
			id: user.id,
			email: user.email,
		}
	}
}
