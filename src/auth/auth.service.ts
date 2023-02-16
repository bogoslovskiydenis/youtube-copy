import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from 'nestjs-typegoose'
import { AuthDto } from './auth.dto'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { compare, genSalt, hash } from 'bcryptjs'
import { UserModel } from 'src/user/user.model/user.model'

@Injectable()
export class AuthService {
	constructor(
		private readonly jwtService: JwtService,
		@InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>,
	) {}

	// login
	async login(dto: AuthDto) {
		const user = await this.validateUser(dto)

		return {
			user: this.returnUserFields(user),
			accessToken: await this.issueAccessToken(String(user._id)),
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
			accessToken: await this.issueAccessToken(String(user._id)),
		}
	}

	async validateUser(dto: AuthDto): Promise<UserModel> {
		const user = await this.UserModel.findOne({ email: dto.email })
		if (!user) throw new UnauthorizedException('User not found')

		const isValidPassword = await compare(dto.password, user.password)
		if (!isValidPassword) throw new UnauthorizedException('Invalid password')

		return user
	}

	async issueAccessToken(userId: string) {
		const data = { _id: userId }

		const accessT = await this.jwtService.signAsync(data, {
			expiresIn: '31',
		})
		return { accessT }
	}

	returnUserFields(user: UserModel) {
		return {
			_id: user._id,
			email: user.email,
		}
	}
}
