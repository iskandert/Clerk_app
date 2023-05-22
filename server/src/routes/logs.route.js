import Route from './route.js'
import logsController from '../controllers/logs.controller.js'
import queryMiddleware from '../middlewares/query.middleware.js'
import responseMiddleware from '../middlewares/response.middleware.js'

class logsRoute extends Route {
  // url = '/logs'
  url = '/auth'
  controller = new logsController()
  query = queryMiddleware
  response = responseMiddleware

  constructor() {
    super()
    this.initRoutes()
  }

  initRoutes = () => {
    // this.router.post(`${this.url}/`, this.query, this.controller.create, this.response)
    this.router.get(`${this.url}/login`, this.query, this.controller.auth, this.response)
    // GET google auth
    // GET all data
    // GET user settings
    // PUT all data
    // PUT user settings
  }
}

export default logsRoute
