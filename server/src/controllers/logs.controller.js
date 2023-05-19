import LogsRepository from '../respositories/logs.repository.js'
import Controller from './controller.js'

class LogsController extends Controller {
  repository = new LogsRepository()

  constructor() {
    super()

    this.initController([this.create])
  }

  create = async (req, res, next) => {
    const user = await this.repository.create(req.body)
    return this.createResponse(200, user)
  }
}

export default LogsController
