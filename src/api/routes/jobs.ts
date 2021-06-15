import express from 'express'
import { repo } from '../../database'
import { createJob, getJob, getJobs } from '../../job'
import { v4 as uuid } from 'uuid'
import { pool } from '../../adb'

const router = express.Router()

type CreateJobBody = {
  name: string
  taskId: string
  onSuccessTaskId: string // For future use
  onErrorTaskId: string // For future use
}

type JobDto = {
  jobId: string
  name: string
  started: string
  finished: string
}

type JobDetailsDto = JobDto & {
  status: {
    serial: string
    success: boolean
    message?: string
    task: {
      cmd: string
      output?: string
    }[]
  }[]
}

router.get('/', async (_req, res) => {
  const jobs = getJobs()
  if (!jobs) {
    return res.status(200).send({ jobs: [] })
  }

  const jobDtos = Object.entries(jobs).reduce((acc, [jobId, job]) => {
    acc = [
      ...acc,
      {
        jobId,
        name: job.name,
        started: job.timestamp,
        finished: job.hasFinished as any as string,
      },
    ]

    return acc
  }, new Array<JobDto>())

  return res.status(200).send({ jobs: jobDtos })
})

router.get('/:jobId', async (req, res) => {
  const jobId = req.params['jobId'],
    job = getJob(jobId)

  if (!job) {
    return res.status(404).send({ job: undefined })
  }

  const jobDto: JobDetailsDto = {
    jobId,
    name: job.name,
    started: job.timestamp,
    finished: job.hasFinished as any as string,
    status: Object.entries(job.status).reduce(
      (acc, [serial, status]) => {
        acc = [
          ...acc,
          {
            serial,
            success: status.success,
            message: status.message,
            task: status.task,
          },
        ]
        return acc
      },
      new Array<{
        serial: string
        success: boolean
        output?: string
        message?: string
        task: {
          cmd: string
          output?: string
        }[]
      }>()
    ),
  }

  return res.status(200).send({ job: jobDto })
})

router.post('/', async (req, res) => {
  const body = req.body as CreateJobBody

  if (!(body.name && typeof body.name === 'string')) {
    return res.status(400).send('Invalid property name')
  }

  if (!(body.taskId && typeof body.taskId === 'string')) {
    return res.status(400).send('Invalid property taskId')
  }

  const assets = await repo.assets.get(),
    serials = assets.map(a => a.serial),
    task = await repo.tasks.get(body.taskId)

  if (!task) {
    return res.status(400).send('Task does not exist')
  }

  const jobId = uuid(),
    job = createJob(jobId, task.unitsOfWork, serials, body.name)

  job.start(pool)

  return res.status(201).send({ jobId })
})

export default router
