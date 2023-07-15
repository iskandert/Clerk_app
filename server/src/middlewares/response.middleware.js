import createError from './error.middleware.js'

const responseMiddleware = (req, res, next) => {
  console.log('in res middleware')
  try {
    const { status, data, options } = req.response
    console.log(status, data, options)

    const response = {
      status: status || 200,
      message: options?.message || 'Success',
      data: data || {},
    }

    return res.status(response.status).json(response)
  } catch (error) {
    return next(createError(error))
  }
}

export default responseMiddleware
