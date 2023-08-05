import dayjs from 'dayjs'
import { ElNotification } from 'element-plus'

function setValueAfterDelay(func, [ov, nv], delay = 0, time = dayjs()) {
  func(ov)
  // console.log('utils:', delay, dayjs().diff(time, 's'))
  let timeout = delay - dayjs().diff(time, 's') - 60
  if (timeout < 0) timeout = 0
  return setTimeout(() => {
    func(nv)
  }, timeout * 1000)
}

async function notifyWrap(obj) {
  try {
    console.log(obj)
    await ElNotification({
      title: 'Произошла ошибка',
      message: obj.response?.data?.messageClient || obj.messageClient || obj.response?.data.message || obj.message || obj,
      type: 'error',
    })
  } catch (err) {
    console.error('Error in copying text: ', err)
  }
}

function cloneByJSON(obj) {
  return JSON.parse(JSON.stringify(obj))
}

function isEqual(obj1, obj2) {
  return JSON.stringify(obj1) === JSON.stringify(obj2)
}

function getEntityField(list, id, field = 'name', checkField = '_id') {
  const getValue = (key) => {
    const obj = list.find((e) => key === e[checkField])
    if (obj) return obj[field]
    return ''
  }
  if (Array.isArray(id)) {
    // console.log(id.map((key) => getValue(key)))
    return id.map((key) => getValue(key))
  }
  return getValue(id)
}

function getObjectFromArray(array, field = '_id') {
  return Object.fromEntries(array.filter((item) => item[field]).map((item) => [item[field], item]))
}

function getFormattedCount(num, { mode, accuracy } = {}) {
  mode = mode ?? 'normal'
  accuracy = accuracy ?? 2
  const formatter = new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits: accuracy,
  })
  if (mode === 'normal') {
    return formatter.format(num)
  }
  if (mode === 'currency') {
    return new Intl.NumberFormat('ru', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: accuracy,
    }).format(num)
  }
}

function mapObject(obj, cb, keyAccess) {
  return Object.fromEntries(
    Object.entries(cloneByJSON(obj)).map(([k, v]) => {
      return !keyAccess ? [k, cb(v)] : cb(k, v)
    })
  )
}

function mapObjectToArr(obj, cb) {
  return Object.entries(cloneByJSON(obj)).map(([k, v], i, arr) => {
    return cb([k, v], i, arr)
  })
}

function filterObject(obj, cb) {
  return Object.fromEntries(
    Object.entries(cloneByJSON(obj)).filter(([k, v]) => {
      return !!cb(k, v)
    })
  )
}

function compareByOrder(list, v1, v2) {
  const [idx1, idx2] = [list.indexOf(v1), list.indexOf(v2)]
  if (idx1 === -1 || idx2 === -1) return 0
  return idx1 - idx2
}

export {
  //
  setValueAfterDelay,
  notifyWrap,
  cloneByJSON,
  isEqual,
  getEntityField,
  getFormattedCount,
  mapObject,
  mapObjectToArr,
  filterObject,
  getObjectFromArray,
  compareByOrder,
}
