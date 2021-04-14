import adb from '@devicefarmer/adbkit'
import { doWork } from './connect'
import { test } from './express-server'
;(async () => {
  try {
    const client = adb.createClient()
    await doWork(client)
    console.log('Kind of done')
  } catch (e) {
    console.error('Kind of error')
  }
})()
test()
