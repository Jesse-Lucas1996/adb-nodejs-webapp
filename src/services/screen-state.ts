import { pool } from '../adb'
import { executeShellCommand } from '../adb/connection-pool'
import { repo, store } from '../database'
import { PersistedEvent } from '../database/store/types'
import { createLogger } from '../logger'
import { DeserializationError } from '../types'

const CYCLE_TIMEOUT_MSEC = 60 * 1000
const logger = createLogger('screen-state-service')
let shouldRun = false

export function createScreenStateService() {
  function start() {
    if (shouldRun) {
      return
    }
    shouldRun = true
    Promise.resolve(startCycle())
    logger.info('Service has started')
  }

  function stop() {
    if (!shouldRun) {
      return
    }
    shouldRun = false
    logger.info('Service has stopped')
  }

  async function startCycle() {
    logger.debug('Started cycle')
    const assets = await repo.assets.get(),
      serials = assets.map(a => a.serial)

    for (const serial of serials) {
      const event = {
        serial,
        timestamp: new Date().toISOString(),
      } as PersistedScreenStateEvent

      let rawOutput: string = undefined as any

      try {
        const client = pool.getDeviceClient(serial)
        if (client) {
          rawOutput = await executeShellCommand(
            client,
            'dumpsys display | grep -e "mState="'
          )
          const evt = deserializeScreenState(rawOutput)
          event['event'] = evt
        } else {
          throw new Error('Device client does not exist')
        }
      } catch (ex) {
        event['errorMessage'] = ex.message
        event['error'] =
          ex instanceof DeserializationError ? 'deserialization' : 'connection'
        event['metadata'] =
          ex instanceof DeserializationError
            ? {
                rawOutput,
              }
            : undefined
      } finally {
        await store.screenState.append(event)
      }
    }
    logger.debug('Stopped cycle')

    if (shouldRun) {
      logger.debug('Scheduled next cycle')
      setTimeout(async () => await startCycle(), CYCLE_TIMEOUT_MSEC)
    }
  }

  return { start, stop }
}

function deserializeScreenState(raw: string): ScreenStateEvent {
  if (typeof raw !== 'string') {
    throw new DeserializationError('Invalid type of data')
  }

  const [key, value] = raw.split('=')
  if (!(key && value)) {
    throw new DeserializationError(
      'One or all components of key/value pair is missing'
    )
  }

  if (key !== 'mState') {
    throw new DeserializationError('Invalid key')
  }

  if (!(value === 'ON' || value === 'OFF')) {
    throw new DeserializationError('Invalid value')
  }

  return value.toLowerCase() as ScreenStateEvent
}

type ScreenStateEvent = 'on' | 'off'

export type PersistedScreenStateEvent = PersistedEvent<ScreenStateEvent>
