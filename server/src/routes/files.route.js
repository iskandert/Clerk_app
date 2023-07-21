import Route from './route.js'
import FilesController from '../controllers/files.controller.js'
import queryMiddleware from '../middlewares/query.middleware.js'
import responseMiddleware from '../middlewares/response.middleware.js'

class FilesRoute extends Route {
  controller = new FilesController()
  query = queryMiddleware
  response = responseMiddleware

  constructor() {
    super()
    this.initRoutes()
  }

  initRoutes = () => {
    this.router.get(`/meta`, this.query, this.controller.getMeta, this.response)
    this.router.delete(`/data`, this.query, this.controller.deleteAll, this.response)
    this.router.get(`/data`, this.query, this.controller.getAll, this.response)
    this.router.put(`/data/:_id`, this.query, this.controller.updateOne, this.response)
  }
}

export default FilesRoute
