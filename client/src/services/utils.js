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
    await ElNotification({
      title: 'Произошла ошибка',
      message: obj.response?.data?.messageClient || obj.messageClient || obj.response?.data.message || obj.message || obj,
      type: 'error',
    })
  } catch (err) {
    console.error('Error in copying text: ', err)
  }
}

export {
  //
  setValueAfterDelay,
  notifyWrap,
}
