import createError from './error.middleware.js'

const queryMiddleware = (req, res, next) => {
  try {
    console.log('in query mw')
    // setPaginationParams(req, res, next) //установка и валидация пагинации
    // setSelectParams(req, res, next) //установка и валидация селекции
    // setSortingParams(req, res, next) //установка и валидация сортировки
    // setFilterParams(req, res, next) //установка и валидация фильтрации

    next()
  } catch (error) {
    return next(createError(error))
  }
}

//установка и валидация пагинации
function setPaginationParams(req, res, next) {
  const paginationParams = { _limit: 50, _offset: 0, _page: 1 }

  for (let [key, value] of Object.entries(paginationParams)) {
    if (req.query[key] === undefined) req.query[key] = value
    else if (isNaN(req.query[key])) throw createError(400, `Parameter ${key} is not number`)
    else req.query[key] = +req.query[key]
  }

  req.query._skip = (req.query._page - 1) * req.query._limit + req.query._offset
}

//установка и валидация селекции
function setSelectParams(req, res, next) {
  req.query._select = req.query._select
}

//установка и валидация сортировки
function setSortingParams(req, res, next) {
  const _sort = {}
  let sortStr = req.query._sort

  if (!sortStr) return
  if (!sortStr.match(/^(?:[A-Za-z0-9\._]*?:(?:asc|desc))(?:,(?:[a-z\._]*?:(?:asc|desc))|$)$/)) throw createError(400, `Parameter _sort is not valid`)

  //преобразование строки в объект
  sortStr.split(',').forEach((item) => {
    item = item.split(':')
    _sort[item[0]] = item[1]
  })

  req.query._sort = _sort
}

//установка и валидация фильтрации
function setFilterParams(req, res, next) {
  let _filter = {}

  if (req.query._search) _filter = { $text: { $search: req.query._search } } //полнотекстовой поиск

  let _filterQuery = deleteMetaParams({ ...req.query }) //удаление мета параметров из объекта

  for (let [key, value] of Object.entries(_filterQuery)) {
    _filter = { ..._filter, ...getParam(key, value, next) }
  }

  req.query._filter = _filter
}

//генерация объекта для фильтрации в БД
function getParam(key, value, next) {
  const getValuesByObject = (value) => {
    value = value.map((val) => getValue(val))

    if (typeof value[0] === 'object') {
      const valueObject = {}

      value.forEach((value) => {
        for (const [key, val] of Object.entries(value)) {
          valueObject[key] = val
        }
      })

      value = valueObject
    }

    return value
  }

  value = typeof value === 'object' ? getValuesByObject(value) : getValue(value)
  if (value === null) throw createError(400, `Query parameter is not valid`)

  return { [key]: value }
}

//получение значения для фильтрации
function getValue(value) {
  const getDate = (operator, value) => {
    if (operator === null) value = { $gte: moment(value).startOf('day').utc(), $lte: moment(value).endOf('day').utc() }
    else if (operator === 'gt' || operator === 'gte') value = moment(value).startOf('day').utc()
    else if (operator === 'lt' || operator === 'lte') value = moment(value).endOf('day').utc()

    return value
  }

  if (value.match(/^[0-9]*?-[0-1][0-9]-[0-3][0-9]$/)) return getDate(null, value) //для key=0000-00-00
  if (value.match(/^[A-Za-zА-Яа-я0-9-\s]*?$/)) return value //для key=value
  if (value.match(/^(gt|gte|lt|lte|ne):[A-Za-zА-Яа-я0-9-\s]+?$/)) {
    //для key=gt:value
    value = value.split(':')

    // если есть поиск по дате
    if (value[1].match(/^[0-9]*?-[0-1][0-9]-[0-3][0-9]$/)) value[1] = getDate(value[0], value[1])

    return { ['$' + value[0]]: value[1] } //для key=gt:value
  }

  return null
}

//удаление мета-параметров из объекта
function deleteMetaParams(objForDelProp) {
  const itemsToDelete = ['_limit', '_offset', '_page', '_skip', '_sort', '_search', '_select', '_populate']

  itemsToDelete.forEach((item) => delete objForDelProp[item])

  return objForDelProp
}

export default queryMiddleware
