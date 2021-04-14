import { doWork } from './connect'
import { test } from './api/express-server'
;(async () => {
  try {
    test()
    await doWork()
    console.log('Kind of done')
  } catch (e) {
    console.error('Kind of error')
  }
})()
