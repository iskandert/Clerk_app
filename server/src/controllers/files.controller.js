import { initEntities } from '../configs/initial.config.js'
import GDriveRepository from '../respositories/gdrive.repository.js'
import Controller from './controller.js'

class FilesController extends Controller {
  repository = new GDriveRepository()

  constructor() {
    super()

    this.initController([this.getMeta, this.getAll, this.deleteAll])
  }

  deleteAll = async (req, res, next) => {
    const auth = req.headers.authorization
    let filesMeta = await this.repository.getAppMeta(auth)
    const deletingPromises = []
    for (const { id } of filesMeta) {
      const deletingPromise = this.repository.deleteAppFile(auth, {
        fileId: id,
      })
      deletingPromises.push(deletingPromise)
    }
    const responses = await Promise.all(deletingPromises)
    return this.createResponse(200, {})
  }

  getAll = async (req, res, next) => {
    const auth = req.headers.authorization
    const entities = initEntities()
    let filesMeta = await this.repository.getAppMeta(auth)
    let filesNames = filesMeta.map(({ name }) => name.split('.')[0])
    const loosedFiles = Object.entries(entities).filter(([name]) => !filesNames.includes(name))
    const createdNames = []
    const creatingPromises = []
    for (const [type, entity] of loosedFiles) {
      const fileName = type + '.json'
      const fileData = entity
      const creatingPromise = this.repository.createAppFile(auth, {
        fileName,
        fileData,
        randomSuffix: false,
      })
      creatingPromises.push(creatingPromise)
      createdNames.push(fileName)
    }
    const createdFileIds = await Promise.all(creatingPromises)
    createdFileIds.forEach((id, idx) => filesMeta.push({ id, name: createdNames[idx] }))
    const responses = {}
    const gettigPromises = []
    for (const { id, name } of filesMeta) {
      const gettingPromise = this.repository.getAppFile(auth, { fileId: id })
      gettigPromises.push(gettingPromise)
      responses[name.split('.')[0]] = {
        fileId: id,
        name,
      }
    }
    const fileDataArray = await Promise.all(gettigPromises)
    filesMeta.forEach(({ name }, index) => {
      responses[name.split('.')[0]].data = fileDataArray[index]
    })
    return this.createResponse(200, responses)
  }

  getMeta = async (req, res, next) => {
    const auth = req.headers.authorization
    console.log('controller files')
    const files = await this.repository.getAppMeta(auth)
    console.log('get files')
    return this.createResponse(200, files)
  }
}

export default FilesController
