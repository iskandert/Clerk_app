import LogsModel from '../models/logs.model.js'

class LogsRepository {
  constructor() {}

  create = async (data) => {
    const log = new LogsModel(data)
    await log.save()

    return log
  }
}

export default LogsRepository
