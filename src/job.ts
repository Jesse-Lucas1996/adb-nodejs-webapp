import { Job, JobStatus, Task } from './types'
import adb, { Client } from '@devicefarmer/adbkit'
import bluebird from 'bluebird'

const jobsDb = new Map<string, Job>()

export function registerJob(job: Job) {
  if (jobsDb.has(job.id)) {
    throw new Error(`Job ${job.id} has been already registered`)
  }
  jobsDb.set(job.id, job)
}

export function getJobs(id?:string) {
  const jobs = {}
  if (id) {
    jobs[id] = jobsDb.get(id)?.status()
  } else {
    for (const key of jobsDb.keys()) {
      jobs[key] = jobsDb.get(key)?.status()
    }
  }
  return jobs
}

export function createJob(id: string, ips: string[], task: Task): Job {
  let isRunning = false
  let hasFinished = false
  const jobStatus: JobStatus = {}

  for (const ip of ips) {
    jobStatus[ip] = {
      success: false,
    }
  
  }

  function start(client: Client) {
    if (isRunning) {
      throw new Error(`Job ${id} is already running`)
    }
    if (hasFinished) {
      throw new Error(`Job ${id} has already finished`)
    }
    isRunning = true

    client.listDevices().then(devices => {
      bluebird.map(devices, device => {
        if (!Object.keys(jobStatus).includes(device.id)) {
          return
        }
        const d = client.getDevice(device.id)
        for (const { cmd, validate } of task) {
          d.shell(cmd)
            .then(adb.util.readAll)
            .then(buffer => {
              const output = buffer.toString().trim()
              if (validate) {
                const { error, message } = validate(output)
                jobStatus[device.id] = {
                  ...jobStatus[device.id],
                  success: !error,
                  output,
                  message,
                }
              } else {
                jobStatus[device.id] = {
                  ...jobStatus[device.id],
                  success: true,
                  output,
                }
              }
            })
            .catch(ex => {
              jobStatus[device.id] = {
                ...jobStatus[device.id],
                success: false,
                message: JSON.stringify(ex?.message ?? ex),
              }
            })
        }
        hasFinished = true
      })
    })
  }

  function status() {
    return { status: {...jobStatus}, hasFinished }
  }

  return { id, start, status }
}
