import { repo } from '../database'
import { createLogger } from '../shared/logger'
import { v4 as uuid } from 'uuid'
import { createJob } from '../job'
import { pool } from '../adb'

const CYCLE_TIMEOUT_MSEC = 10 * 1000
const logger = createLogger('emergency-service')
let shouldRun = false

export function createEmergencyService() {
  function start() {
    if (shouldRun) {
      return
    }
    shouldRun = true
    startCycle().catch(ex => logger.error(ex))
    logger.info('Service has started')
  }

  function stop() {
    shouldRun = false
    stopCycle().catch(ex => logger.error(ex))
    logger.info('Service has stopped')
  }

  function status() {
    return {
      isActive: shouldRun,
    }
  }

  async function startCycle() {
    if (shouldRun) {
      try {
        const assets = await repo.assets.get(),
          serials = assets.map(a => a.serial),
          task = await repo.tasks.get('sendEmergency')

        if (!task) {
          throw new Error('Send emergency task does not exist')
        }

        const jobId = uuid(),
          job = createJob(
            jobId,
            task.unitsOfWork,
            serials,
            'emergency-start-cycle'
          )

        job.start(pool)
      } catch (ex: any) {
        logger.error(`${ex.message ?? ex}`)
      } finally {
        setTimeout(async () => await startCycle(), CYCLE_TIMEOUT_MSEC)
      }
    }
  }

  async function stopCycle() {
    try {
      const assets = await repo.assets.get(),
        serials = assets.map(a => a.serial),
        task = await repo.tasks.get('stopEmergency')

      if (!task) {
        throw new Error('Stop emergency task does not exist')
      }

      const jobId = uuid(),
        job = createJob(
          jobId,
          task.unitsOfWork,
          serials,
          'emergency-stop-cycle'
        )

      job.start(pool)
    } catch (ex: any) {
      logger.error(`${ex.message ?? ex}`)
    }
  }

  return {
    start,
    stop,
    status,
  }
}
