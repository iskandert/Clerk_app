import Route from './route.js'
import logsController from '../controllers/logs.controller.js'
import queryMiddleware from '../middlewares/query.middleware.js'
import responseMiddleware from '../middlewares/response.middleware.js'

class logsRoute extends Route {
  url = '/logs'
  controller = new logsController()
  query = queryMiddleware
  response = responseMiddleware

  constructor() {
    super()
    this.initRoutes()
  }

  initRoutes = () => {
    this.router.post(`${this.url}/`, this.query, this.controller.create, this.response)
  }
}

export default logsRoute
