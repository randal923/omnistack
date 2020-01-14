import { Router } from 'express'
import UserController from '../controllers/UserController'
import SearchController from '../controllers/SearchController'
const routes = Router()

routes.post('/users', UserController.create)
routes.get('/users', UserController.index)

routes.get('/search', SearchController.index)

export default routes
