import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { prop } from '@typegoose/typegoose'

export interface UserModel extends Base {}

export class UserModel extends TimeStamps {
	@prop({ unique: true })
	email: string

	@prop()
	password: string

	@prop({ unique: true })
	name: string

	@prop()
	isVerified: string

	@prop()
	subcribersCount: number

	@prop()
	description: string

	@prop()
	location: string

	@prop()
	banner: string

	@prop()
	avatarPath: string
}
