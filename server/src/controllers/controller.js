import createError from 'http-errors'

class Controller {
  controller = []

  initController(data) {
    for (const func of data) {
      this[func.name] = async (req, res, next) => {
        try {
          req.response = await func(req, res, next)
          return next()
        } catch (error) {
          return next(createError(error))
        }
      }
    }
  }

  createResponse = (status, data, options) => {
    return { status, data, options }
  }
}

export default Controller
