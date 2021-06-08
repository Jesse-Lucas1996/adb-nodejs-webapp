import { JobConnectionPool, Jobs, JobStatus, Job, Task } from './types'
import { executeShellCommand } from './adb/connection-pool'
import { createLogger } from './logger'

type JobId = string
const jobsDb = new Map<JobId, Job>()

const logger = createLogger('jobs')

function registerJob(job: Job) {
  if (jobsDb.has(job.id)) {
    throw new Error(`Job ${job.id} has been already registered`)
  }
  jobsDb.set(job.id, job)
}

export function getJob(id: string):
  | {
      status: JobStatus
      hasFinished: boolean
    }
  | undefined {
  return jobsDb.get(id)?.status()
}

export function getJobs(): Jobs {
  const jobs = {} as Jobs
  for (const key of jobsDb.keys()) {
    jobs[key] = jobsDb.get(key)?.status()
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
      success: false,
    }
  }

  function start(pool: JobConnectionPool) {
    Promise.resolve(runJob(pool))
  }

  async function runJob(pool: JobConnectionPool) {
    if (isRunning) {
      throw new Error(`Job ${jobId} is already running`)
    }
    if (hasFinished) {
      throw new Error(`Job ${jobId} has already finished`)
    }
    isRunning = true

    for (const serial of Object.keys(jobStatus)) {
      try {
        const client = pool.getDeviceClient(serial)
        if (!client) {
          logger.warning(
            `JobId: ${jobId} skipped device: ${serial} as it's offline`
          )
          continue
        }

        for (const { cmd, validate } of task) {
          const output = await executeShellCommand(client, cmd)

          if (validate) {
            const { error, message } = validate(output)
            jobStatus[serial] = {
              ...jobStatus[serial],
              success: !error,
              output,
              message,
            }
          } else {
            jobStatus[serial] = {
              ...jobStatus[serial],
              success: true,
              output,
            }
          }
        }
      } catch (ex) {
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
