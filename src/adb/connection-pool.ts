import adb, { Client, Device, DeviceClient } from '@devicefarmer/adbkit'
import path from 'path'
import { repo } from '../database'
import { createLogger } from '../logger'

const CYCLE_TIMEOUT_MSEC = 10 * 1000
const PORT = 5555

const logger = createLogger('connection-pool')

type DeviceState = {
  state: 'online' | 'offline'
  connection?: string
}

type DeviceSerial = string

export function createConnectionPool(): ConnectionPool {
  let ips: string[] = []

  const deviceState = new Map<DeviceSerial, DeviceState>()

  const client = adb.createClient()
  client.trackDevices().then(tracker => {
    tracker.on('remove', async (device: Device) => {
      for (const [serial, { connection }] of [...deviceState]) {
        if (connection === device.id) {
          deviceState.set(serial, { state: 'offline' })
        }
      }
    })
  })

  let isRunning = false
  let shouldRun = false

  function start() {
    shouldRun = true
    startOnce()
    logger.info('Pool has started')
  }

  async function startCycle() {
    if (isRunning) {
      return logger.warning('An active cycle is still running. Ignoring.')
    }
    isRunning = true

    const deviceAssests = await repo.assets.get()
    for (const asset of deviceAssests) {
      if (!deviceState.has(asset.serial)) {
        deviceState.set(asset.serial, { state: 'offline' })
      }
    }

    ips = await repo.connectionCandidates.get()

    for (const ip of ips) {
      try {
        const connectionString = await client.connect(`${ip}:${PORT}`),
          deviceClient = client.getDevice(connectionString),
          serial = await getSerialNumber(deviceClient)

        deviceState.set(serial, {
          state: 'online',
          connection: connectionString,
        })
      } catch (ex) {
        logger.error(
          `Failed to connect to ${ip} Details: ${JSON.stringify(ex)}`
        )
      }
    }

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

  async function getState() {
    const deviceStateDto = {} as {
      [K in DeviceSerial]: DeviceState & { name: string }
    }

    const deviceAssets = await repo.assets.get()

    for (const [serial, state] of [...deviceState]) {
      const asset = deviceAssets.find(a => a.serial === serial)
      deviceStateDto[serial] = { ...state, name: asset?.name ?? '' }
    }
    return deviceStateDto
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

  function getDeviceClient(serial: string) {
    const device = deviceState.get(serial)
    if (!device || !device.connection) {
      return undefined
    }
    return client.getDevice(device.connection)
  }

  return { start, stop, client, getState, getDeviceClient }
}

export type ConnectionPool = {
  start: () => void
  stop: () => void
  client: Client
  getState: () => Promise<
    { [K in DeviceSerial]: DeviceState & { name: string } }
  >
  getDeviceClient: (serial: string) => DeviceClient | undefined
}

export async function executeShellCommand(client: DeviceClient, cmd: string) {
  const stream = await client.shell(cmd)
  const buffer = await adb.util.readAll(stream)
  return buffer.toString().trim()
}

export async function installApk(client: DeviceClient, apkPath: string) {
  const result = await client.install(apkPath)
  return `Installed: ${result}` // TODO Make dispatcher
}

export async function getSerialNumber(client: DeviceClient) {
  return executeShellCommand(client, 'getprop ro.boot.serialno')
}

function isInstallCmd(cmd: string) {
  const [prefix, _] = cmd.split(' ')
  return prefix === 'install'
}

export function getDispatcher(cmd: string) {
  if (isInstallCmd(cmd)) {
    const apkPath = `./${cmd.split(' ')[1]}`
    const fullPath = path.join(__dirname.replace('/adb', ''), apkPath) // TODO: Get away from this horrible hack

    return {
      dispatch: installApk,
      args: fullPath,
    }
  }

  return {
    dispatch: executeShellCommand,
    args: cmd,
  }
}
