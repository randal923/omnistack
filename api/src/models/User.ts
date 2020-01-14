import { Document, Schema, model } from 'mongoose'
import PointSchema from './utils/PointSchema'

interface UserInterface extends Document {
    email?: string;
    name?: string;
    githubUsername?: string;
    avatarUrl?: string;
    techs?: [string];
    bio?: string;
  }

const UserSchema = new Schema({
	email: String,
	name: String,
	bio: String,
	githubUsername: String,
	avatarUrl: String,
	techs: [String],
	location: {
		type: PointSchema,
		index: '2dsphere'
	}
}, {
	timestamps: true
})

UserSchema.methods.fullName = function (): string {
	return (this.firstName.trim() + ' ' + this.lastName.trim())
}

export default model<UserInterface>('User', UserSchema)
