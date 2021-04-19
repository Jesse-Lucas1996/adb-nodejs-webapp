import adb from '@devicefarmer/adbkit'

const CYCLE_TIMEOUT_MSEC = 10000
const PORT = 5555

export function createAdbConnector(ips: string[]) {
  const client = adb.createClient()

  let isRunning = false
  let shouldRun = false

  function start() {
    shouldRun = true
    startOnce()
    console.log('Connector started')
  }

  function startOnce() {
    if (isRunning) {
      return console.warn('An active cycle is still running. Ignoring.')
    }

    try {
      isRunning = true
      for (const ip of ips) {
        client.connect(`${ip}:${PORT}`)
      }
    } catch (ex) {
      console.error(
        'Exception has been thrown while trying to connect to IP',
        JSON.stringify(ex)
      )
    } finally {
      isRunning = false
      if (shouldRun) {
        setTimeout(() => {
          startOnce()
        }, CYCLE_TIMEOUT_MSEC)
      }
    }
  }

  function stop() {
    shouldRun = false
  }

  return { start, stop, client }
}
