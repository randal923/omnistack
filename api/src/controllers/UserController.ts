import { Request, Response } from 'express'
import User from '../models/User'
import axios from 'axios'

import { parseStringAsArray } from '../utils/parseStringAsArray'

class UserController {
	public async index (req: Request, res: Response): Promise<Response> {
		try {
			const users = await User.find()

			return res.json(users)
		}catch(e){
			console.log(e)
		}
	}

	public async create (req: Request, res: Response): Promise<Response> {
		const { githubUsername , techs, latitude, longitude } = req.body

		try {
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

			// filter connections in a 10km radius
			
		}

		return res.json(user)
		}catch(e) {
			console.log(e)
		}
	}
}

export default new UserController()
