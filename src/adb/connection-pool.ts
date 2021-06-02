import adb, { Device, DeviceClient } from '@devicefarmer/adbkit'
import { repo } from '../database'
import { createLogger } from '../logger'

const CYCLE_TIMEOUT_MSEC = 10 * 1000
const PORT = 5555

const logger = createLogger('connection-pool')

export function createConnectionPool() {
  let ips: string[] = []

  const ipDb = new Map<string, { state: string }>()
  for (const ip of ips) {
    ipDb.set(ip, { state: 'disconnected' })
  }

  const client = adb.createClient()
  client.trackDevices().then(tracker => {
    tracker.on('add', (device: Device) => {
      console.log('::: ON ADD event listener. device: ', device.id)
    })
    tracker.on('remove', (device: Device) => {
      console.log('::: ON REMOVE event listener. device: ', device.id)
    })
    tracker.on('end', (data: any) => {
      console.log('::: ON END event listener. WTF what: ', data)
    })
  })

  let isRunning = false
  let shouldRun = false

  function start() {
    shouldRun = true
    startOnce()
    logger.info('Pool has started')
  }
  const discoveredIps = new Set<string>()

  async function startCycle() {
    if (isRunning) {
      return logger.warning('An active cycle is still running. Ignoring.')
    }
    isRunning = true

    ips = repo.ipScannerCandidates.get()

    for (const ip of ips) {
      try {
        const connectionString = await client.connect(`${ip}:${PORT}`)
        const deviceClient = client.getDevice(connectionString)
        const serial = await getSerialNumber(deviceClient)

        console.log(serial)

        console.log(deviceClient)
      } catch (ex) {
        logger.error(
          `Failed to connect to ${ip} Details: ${JSON.stringify(ex)}`
        )
      }
    }

    const devices = await client.listDevices()
    for (const device of devices) {
      discoveredIps.add(device.id.split(':')[0])
    }

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

  function startOnce() {
    Promise.resolve(startCycle())
  }

  function getStatus() {
    const deviceObjects = {} as { [K in string]: { state: string } }
    ipDb.forEach((state, ip) => (deviceObjects[ip] = state))
    return deviceObjects
  }

  async function stopCycle() {
    shouldRun = false
    for (const ip of ips) {
      try {
        await client.disconnect(`${ip}:${PORT}`)
      } catch (ex) {
        logger.error(
          `Disconnection error for device ${ip} Details: ${JSON.stringify(ex)}`
        )
      }
    }
    logger.info('Pool has stopped')
  }

  function stop() {
    Promise.resolve(stopCycle())
  }

  return { start, stop, client, getStatus }
}

async function executeShellCommand(dc: DeviceClient, cmd: string) {
  const stream = await dc.shell(cmd)
  const buffer = await adb.util.readAll(stream)
  return buffer.toString().trim()
}

async function getSerialNumber(dc: DeviceClient) {
  return executeShellCommand(dc, 'getprop ro.boot.serialno')
}
