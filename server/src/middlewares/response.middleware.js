import createError from './error.middleware.js'

const responseMiddleware = (req, res, next) => {
  try {
    const { status, data, options } = req.response

    const response = {
      status: status || 200,
      message: options?.message || 'Success',
      data: data || {},
      meta: options?.meta ? getMeta({ ...req.query, ...options.meta }) : undefined,
    }

    return res.status(response.status).json(response)
  } catch (error) {
    return next(createError(error))
  }
}

//получение мета-данных запроса
function getMeta(meta) {
  return {
    ...getMetaPagination(meta),
  }
}

//формирование мета-данных пагинации
function getMetaPagination({ _totalItems, _limit, _page, _offset }) {
  const _totalPages = Math.ceil(_totalItems / _limit)

  return { _totalItems, _limit, _page, _totalPages, _offset }
}

export default responseMiddleware
