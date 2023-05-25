import LogsRepository from '../respositories/logs.repository.js'
import Controller from './controller.js'

class LogsController extends Controller {
  repository = new LogsRepository()

  constructor() {
    super()

    this.initController([this.create, this.files, this.auth])
  }

  create = async (req, res, next) => {
    const user = await this.repository.create(req.body)
    return this.createResponse(200, user)
  }

  files = async (req, res, next) => {
    console.log('controller files')
    const files = await this.repository.files(req.headers.authorization.split(' ')[1])
    console.log('get files')
    return this.createResponse(200, files)
  }

  auth = async (req, res, next) => {
    console.log('auth fish')
    return this.createResponse(200, { auth: true })
  }
}

export default LogsController
