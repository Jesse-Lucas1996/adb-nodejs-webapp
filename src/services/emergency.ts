import { repo } from '../database'
import { createLogger } from '../logger'
import { createTask } from '../task'
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
    Promise.resolve(startCycle())
    logger.info('Service has started')
  }

  function stop() {
    if (!shouldRun) {
      return
    }
    shouldRun = false
    Promise.resolve(stopCycle())
    logger.info('Service has stopped')
  }

  function status() {
    return {
      isActive: shouldRun,
    }
  }

  async function startCycle() {
    if (shouldRun) {
      const assets = await repo.assets.get(),
        serials = assets.map(a => a.serial),
        task = createTask('sendEmergency'),
        jobId = uuid(),
        job = createJob(jobId, task, serials, 'emergency-start-cycle')

      job.start(pool)

      setTimeout(async () => await startCycle(), CYCLE_TIMEOUT_MSEC)
    }
  }

  async function stopCycle() {
    const assets = await repo.assets.get(),
      serials = assets.map(a => a.serial),
      task = createTask('stopEmergency'),
      jobId = uuid(),
      job = createJob(jobId, task, serials, 'emergency-stop-cycle')

    job.start(pool)
  }

  return {
    start,
    stop,
    status,
  }
}
