import dayjs from 'dayjs'

function setValueAfterDelay(func, [ov, nv], delay = 0, time = dayjs()) {
  func(ov)
  // console.log('utils:', delay, dayjs().diff(time, 's'))
  let timeout = delay - dayjs().diff(time, 's') - 60
  if (timeout < 0) timeout = 0
  return setTimeout(() => {
    func(nv)
  }, timeout * 1000)
}

export {
  //
  setValueAfterDelay,
}
