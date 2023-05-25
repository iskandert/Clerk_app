// import logger from '../configs/winston.config.js'

export default function errorHandler(error, req, res, next) {
  const response = {
    status: error.status,
    message: error.status === 500 ? 'Internal Server Error' : error.message,
  }

  const errorObj = {
    ip: req.ip,
    path: req._parsedUrl.pathname,
    request: {
      method: req.method,
      url: req.url,
      params: req.params,
      body: req.body,
    },
    ...response,
  }

  // logger.error(errorObj)

  console.log(error.stack)
  res.status(error.status).json(response)
}
