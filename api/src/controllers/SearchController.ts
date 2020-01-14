import { Request, Response } from 'express'

import { parseStringAsArray } from '../utils/parseStringAsArray'
import User from '../models/User'

class SearchController {
	public async index (req: Request, res: Response): Promise<Response> {
		const { latitude, longitude, techs } = req.query
		const techsArray = parseStringAsArray(techs)

		const users = await User.find({
			techs: {
				$in: techsArray
			},
			location: {
				$near: {
					$geometry: {
						type: 'Point',
						coordinates: [longitude, latitude]
					}
				},
				$maxDistance: 10000
			}
		})
		return res.json(users)
	}
}

export default new SearchController()
