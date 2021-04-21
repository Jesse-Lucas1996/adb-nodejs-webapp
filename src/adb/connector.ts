import adb from '@devicefarmer/adbkit'

const CYCLE_TIMEOUT_MSEC = 10000
const PORT = 5555

export function createConnectionPool(ips: string[]) {
  const ipDb = new Map<string, { state: string }>()
  for (const ip of ips) {
    ipDb.set(ip, { state: 'disconnected' })
  }

  const client = adb.createClient()

  let isRunning = false
  let shouldRun = false

  function start() {
    shouldRun = true
    startOnce()
    console.log('Connector started')
  }
  const discoveredIps = new Set<string>()

  function startOnce() {
    if (isRunning) {
      return console.warn('An active cycle is still running. Ignoring.')
    }
    isRunning = true

    for (const ip of ips) {
      client
        .connect(`${ip}:${PORT}`)
        .catch(ex =>
          console.warn(
            'Failed to connect to ',
            ip,
            'Details',
            JSON.stringify(ex)
          )
        )
    }

    client.listDevices().then(devices =>
      devices.map(d => {
        discoveredIps.add(d.id.split(':')[0])
      })
    )
    console.log(ipDb)
    for (const ip of ipDb.keys()) {
      const state = discoveredIps.has(ip) ? 'connected' : 'disconnected'
      ipDb.set(ip, { state })
    }

    discoveredIps.clear()

    isRunning = false

    if (shouldRun) {
      setTimeout(() => {
        startOnce()
      }, CYCLE_TIMEOUT_MSEC)
    }
  }

  function getStatus() {
    const deviceObjects = {}
    ipDb.forEach((state, ip) => (deviceObjects[ip] = state))
    console.log('this is an object: ', deviceObjects)
    return deviceObjects
  }

  function stop() {
    shouldRun = false
    for (const ip of ips) {
      client
        .disconnect(`${ip}:${PORT}`)
        .catch(ex =>
          console.warn(
            'Disconnection error for device',
            ip,
            'Details',
            JSON.stringify(ex)
          )
        )
    }
    console.log('everything disconnected')
  }

  return { start, stop, client, getStatus }
}
