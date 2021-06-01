import adb from '@devicefarmer/adbkit'
import { createLogger } from '../logger'

const CYCLE_TIMEOUT_MSEC = 10000
const PORT = 5555

const logger = createLogger('connection-pool')

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
    logger.info('Connection pool has started')
  }
  const discoveredIps = new Set<string>()

  function startOnce() {
    if (isRunning) {
      return logger.warning('An active cycle is still running. Ignoring.')
    }
    isRunning = true

    for (const ip of ips) {
      client
        .connect(`${ip}:${PORT}`)
        .catch(ex =>
          logger.error(
            `Failed to connect to ${ip} Details: ${JSON.stringify(ex)}`
          )
        )
    }

    client.listDevices().then(devices =>
      devices.map(d => {
        discoveredIps.add(d.id.split(':')[0])
      })
    )

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
    const deviceObjects = {} as { [K in string]: { state: string } }
    ipDb.forEach((state, ip) => (deviceObjects[ip] = state))
    return deviceObjects
  }

  function stop() {
    shouldRun = false
    for (const ip of ips) {
      client
        .disconnect(`${ip}:${PORT}`)
        .catch(ex =>
          logger.error(
            `Disconnection error for device ${ip} Details: ${JSON.stringify(
              ex
            )}`
          )
        )
    }
    logger.info('Connection pool has stopped')
  }

  return { start, stop, client, getStatus }
}
