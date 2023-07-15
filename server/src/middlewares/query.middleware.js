import createError from './error.middleware.js'

const queryMiddleware = (req, res, next) => {
  try {
    console.log('in query mw')

    next()
  } catch (error) {
    return next(createError(error))
  }
}

export default queryMiddleware
