import LogsRepository from '../respositories/logs.repository.js'
import Controller from './controller.js'

class LogsController extends Controller {
  repository = new LogsRepository()

  constructor() {
    super()

    this.initController([this.create, this.files, this.auth, this.alldata])
  }

  create = async (req, res, next) => {
    const user = await this.repository.create(req.body)
    return this.createResponse(200, user)
  }

  files = async (req, res, next) => {
    const auth = req.headers.authorization
    console.log('controller files')
    // const files = await this.repository.files(req.headers.authorization.split(' ')[1])
    const files = await this.repository.files(auth)
    console.log('get files')
    return this.createResponse(200, files)
  }

  alldata = async (req, res, next) => {
    const auth = req.headers.authorization
    console.log('controller alldata')
    // get appFolder metadata
    // if (!metadata.list.length) create appFolderFiles
    // get appFolderFiles
    // create data for response
    let alldata = { data: 'qwerty' }
    let meta = await this.repository.getAppMeta(auth)
    if (!meta.length) {
      console.log('null length')
      alldata = await this.repository.createAppFile(auth)
    }
    console.log('get alldata')
    return this.createResponse(200, alldata)
  }

  auth = async (req, res, next) => {
    console.log('auth fish')
    return this.createResponse(200, { auth: true })
  }
}

export default LogsController
