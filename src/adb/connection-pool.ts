import adb, { Client, Device, DeviceClient } from '@devicefarmer/adbkit'
import path from 'path'
import { repo } from '../database'
import { dispatcher, subscriber } from '../shared/broker'
import { createLogger } from '../shared/logger'

const CYCLE_TIMEOUT_MSEC = 10 * 1000
const PORT = 5555

const logger = createLogger('connection-pool')

type DeviceState = {
  state: 'online' | 'offline'
  provisioned?: boolean
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
          deviceState.set(serial, { state: 'offline', provisioned: undefined })
        }
      }
    })
  })

  subscriber.subscribe('CandidateDiscovered', async ({ ip }) => {
    await tryConnect(ip)
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
      return logger.warn('An active cycle is still running. Ignoring.')
    }
    isRunning = true

    const deviceAssests = await repo.assets.get()
    for (const asset of deviceAssests) {
      if (!deviceState.has(asset.serial)) {
        deviceState.set(asset.serial, {
          state: 'offline',
          provisioned: undefined,
        })
      }
    }

    ips = await repo.connectionCandidates.get()

    for (const ip of ips) {
      await tryConnect(ip)
    }

    isRunning = false

    if (shouldRun) {
      setTimeout(() => {
        startOnce()
      }, CYCLE_TIMEOUT_MSEC)
    }
  }

  async function tryConnect(ip: string) {
    try {
      const connectionString = await client.connect(`${ip}:${PORT}`),
        deviceClient = client.getDevice(connectionString),
        serial = await getSerialNumber(deviceClient),
        provisioned = await isDeviceProvisioned(deviceClient)

      if (!provisioned) {
        dispatcher.dispatch('ProvisionRequested', {
          serial,
        })
      }

      deviceState.set(serial, {
        state: 'online',
        connection: connectionString,
        provisioned,
      })
    } catch (ex: any) {
      logger.warn('Failed to connect to', ip, 'Details', ex.message)
    }
  }

  function startOnce() {
    startCycle().catch(ex => logger.error(ex))
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
        logger.error('Disconnection error for device', ip, 'Details', ex)
      }
    }
    logger.info('Pool has stopped')
  }

  function stop() {
    stopCycle().catch(ex => logger.error(ex))
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
  getState: () => Promise<{
    [K in DeviceSerial]: DeviceState & { name: string }
  }>
  getDeviceClient: (serial: string) => DeviceClient | undefined
}

export async function executeShellCommand(client: DeviceClient, cmd: string) {
  return client
    .shell(cmd)
    .then(s => adb.util.readAll(s))
    .then(b => b.toString().trim())
}

export async function installApk(client: DeviceClient, apkPath: string) {
  return client.install(apkPath).then(r => `Installed: ${r}`)
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
    const fullPath = path.join(__dirname.replace('/adb', ''), apkPath)

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

async function isDeviceProvisioned(client: DeviceClient) {
  const emergencyAppInstalled = executeShellCommand(
    client,
    'pm list packages -f com.emergencyreactnativeapp'
  ).then(r => !!r?.length)

  const dynamicContentAppInstalled = executeShellCommand(
    client,
    'pm list packages -f com.dynamiccontent'
  ).then(r => !!r?.length)

  const wifiSleepPolicySet = executeShellCommand(
    client,
    'settings list global | grep wifi | grep wifi_sleep_policy=2'
  ).then(r => !!r?.length)

  return (
    (await emergencyAppInstalled) &&
    (await dynamicContentAppInstalled) &&
    (await wifiSleepPolicySet)
  )
}
