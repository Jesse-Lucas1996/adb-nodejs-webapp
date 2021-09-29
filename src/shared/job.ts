import {
  JobConnectionPool,
  Jobs,
  JobStatus,
  Job,
  Task,
  ApplicationError,
} from '../types'
import { getDispatcher } from '../adb/connection-pool'
import { createLogger } from './logger'

type JobId = string
const jobsDb = new Map<JobId, Job>()

const logger = createLogger('jobs')

function registerJob(job: Job) {
  if (jobsDb.has(job.id)) {
    throw new ApplicationError(`Job ${job.id} has been already registered`)
  }
  jobsDb.set(job.id, job)
}

export function getJob(id: string) {
  return jobsDb.get(id)?.status()
}

export function getJobs(): Jobs {
  const jobs = {} as Jobs
  for (const key of jobsDb.keys()) {
    jobs[key] = jobsDb.get(key)?.status()!
  }
  return jobs
}

export function createJob(
  jobId: string,
  task: Task,
  serials: string[],
  name: string
) {
  let isRunning = false
  let hasFinished = false
  const jobStatus: JobStatus = {}
  const timestamp = new Date().toISOString()

  const targetSerials = serials
  for (const serial of targetSerials) {
    jobStatus[serial] = {
      success: undefined as any,
      task: [],
    }
  }

  function start(pool: JobConnectionPool) {
    runJob(pool).catch(ex => logger.error(ex))
  }

  async function runJob(pool: JobConnectionPool) {
    if (isRunning) {
      throw new ApplicationError(`Job ${jobId} is already running`)
    }
    if (hasFinished) {
      throw new ApplicationError(`Job ${jobId} has already finished`)
    }
    isRunning = true

    for (const serial of Object.keys(jobStatus)) {
      try {
        const client = pool.getDeviceClient(serial)
        if (!client) {
          const message = `JobId: ${jobId} skipped device: ${serial} as it's offline`
          logger.trace(message)
          jobStatus[serial] = {
            ...jobStatus[serial],
            success: false,
            message: 'Device is offline',
          }
          continue
        }

        for (const { cmd } of task) {
          const { dispatch, args } = getDispatcher(cmd)

          const output = await dispatch(client, args)

          jobStatus[serial] = {
            ...jobStatus[serial],
            success: true,
            task: [...jobStatus[serial].task, { cmd, output }],
          }
        }
      } catch (ex: any) {
        jobStatus[serial] = {
          ...jobStatus[serial],
          success: false,
          message: JSON.stringify(ex?.message ?? ex),
        }
      }
    }
    hasFinished = new Date().toISOString() as unknown as boolean
  }

  function status() {
    return { name, timestamp, status: { ...jobStatus }, hasFinished }
  }

  const job = { id: jobId, start, status, name, timestamp }
  registerJob(job)

  return job
}
