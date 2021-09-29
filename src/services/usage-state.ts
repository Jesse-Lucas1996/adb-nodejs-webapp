import { pool } from '../adb'
import { executeShellCommand } from '../adb/connection-pool'
import { repo, store } from '../database'
import { PersistedEvent } from '../database/store/types'
import { createLogger } from '../shared/logger'
import { ApplicationError, DeserializationError } from '../types'

const CYCLE_TIMEOUT_MSEC = 5 * 60 * 1000
const logger = createLogger('usage-state-service')
let shouldRun = false

export function createUsageStateService() {
  function start() {
    if (shouldRun) {
      return
    }
    shouldRun = true
    startCycle().catch(ex => logger.error(ex))
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
    logger.trace('Started cycle')
    const assets = await repo.assets.get(),
      serials = assets.map(a => a.serial)

    for (const serial of serials) {
      let rawOutput: string = undefined as any

      try {
        const client = pool.getDeviceClient(serial)
        if (client) {
          rawOutput = await executeShellCommand(
            client,
            'dumpsys usagestats -c | grep MOVE_TO'
          )
          const rawEvents = rawOutput.split('\n').map(e => e.trim())
          if (!rawEvents.length) {
            throw new ApplicationError('No raw events received')
          }

          for (const rawEvent of rawEvents) {
            // TODO: Implement batch update along with differential events to avoid duplicates
            try {
              const evt = deserializeUsageState(rawEvent)
              const event: PersistedUsageStateEvent = {
                serial,
                timestamp: new Date().toISOString(),
                event: evt,
              }
              await store.usageState.append(event)
            } catch (ex: any) {
              const event: PersistedUsageStateEvent = {
                serial,
                timestamp: new Date().toISOString(),
                errorMessage: ex?.message ?? '',
                error: 'deserialization',
                metadata: {
                  rawEvent,
                },
              }
              await store.usageState.append(event)
            }
          }
        } else {
          throw new ApplicationError('Device client does not exist')
        }
      } catch (ex: any) {
        const event: PersistedUsageStateEvent = {
          serial,
          timestamp: new Date().toISOString(),
          errorMessage: ex?.message ?? '',
          error: 'connection',
          metadata: {
            rawOutput,
          },
        }
        await store.usageState.append(event)
      }
    }
    logger.trace('Stopped cycle')

    if (shouldRun) {
      logger.trace('Scheduled next cycle')
      setTimeout(async () => await startCycle(), CYCLE_TIMEOUT_MSEC)
    }
  }

  return { start, stop }
}

function deserializeUsageState(raw: string): UsageStateEvent {
  if (typeof raw !== 'string') {
    throw new DeserializationError('Invalid type of data')
  }

  const tokens = raw.split(' ').map(t => t.split('='))
  const event = tokens.reduce((acc, [key, value]) => {
    acc[key] = key === 'time' ? +value : value
    return acc
  }, {} as UsageStateEvent)

  if (!(event.hasOwnProperty('time') && typeof event?.time === 'number')) {
    throw new DeserializationError('Invalid time key or value')
  }

  if (!(event.hasOwnProperty('type') && typeof event?.type === 'string')) {
    throw new DeserializationError('Invalid type key or value')
  }

  if (
    !(event.hasOwnProperty('package') && typeof event?.package === 'string')
  ) {
    throw new DeserializationError('Invalid package key or value')
  }

  if (!(event.hasOwnProperty('class') && typeof event?.class === 'string')) {
    throw new DeserializationError('Invalid class key or value')
  }

  if (!(event.hasOwnProperty('flags') && typeof event?.flags === 'string')) {
    throw new DeserializationError('Invalid flags key or value')
  }

  return event
}

type UsageStateEvent = {
  time: number
  type: string
  package: string
  class: string
  flags: string
}

export type PersistedUsageStateEvent = PersistedEvent<UsageStateEvent>
