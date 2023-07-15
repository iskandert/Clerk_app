export default function errorHandler(error, req, res, next) {
  const response = {
    status: error.status,
    // message: error.status === 500 ? 'Internal Server Error' : error.message,
    message: error.message,
  }

  console.log(error.stack)
  res.status(error.status).json(response)
}
