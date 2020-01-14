import { Request, Response } from 'express'
import User from '../models/User'
import axios from 'axios'

import { parseStringAsArray } from '../utils/parseStringAsArray'

class UserController {
	public async index (req: Request, res: Response): Promise<Response> {
		const users = await User.find()

		return res.json(users)
	}

	public async create (req: Request, res: Response): Promise<Response> {
		const { githubUsername, techs, latitude, longitude } = req.body

		let user = await User.findOne({ githubUsername })

		if (!user) {
			const apiResponse = await axios.get(`https://api.github.com/users/${githubUsername}`)

			const { name, login, avatar_url: avatarUrl, bio } = apiResponse.data

			const userName = name || login
			const techsArray = parseStringAsArray(techs)

			const location = {
				type: 'Point',
				coordinates: [longitude, latitude]
			}
			user = await User.create({
				githubUsername,
				name: userName,
				avatarUrl,
				bio,
				techs: techsArray,
				location
			})
		}

		return res.json(user)
	}
}

export default new UserController()
