import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { prop } from '@typegoose/typegoose'

export interface VideoModel extends Base {}

export class VideoModel extends TimeStamps {
	@prop({ unique: true })
	name: string

	@prop()
	isPublic: string

	@prop({ default: 0 })
	view?: number

	@prop({ default: 0 })
	like?: number

	@prop({ default: 0 })
	dislike?: number

	@prop()
	description: number

	@prop()
	videoPath: string

	@prop()
	posterPath: string
}
