import LogsModel from '../models/logs.model.js'

class LogsRepository {
  constructor() {}

  create = async (data) => {
    // const log = new LogsModel(data)
    // await log.save()

    const log = 'abcdefg'
    console.log('in repo')
    return log
  }
}

export default LogsRepository
