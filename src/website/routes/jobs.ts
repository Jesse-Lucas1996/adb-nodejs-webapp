import express from 'express'
import { Jobs } from '../../types'
import { api } from '../utils'
import { getJob } from '../../job'

const router = express.Router()

type JobDto = {
  jobId: string
  name: string
  started: string
  finished: string
}

router.get('/', async (_req, res) => {
  const resp = await api.get('/jobs')
  const jobs = resp.data.jobs as Jobs

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

  res.render('jobs/list.pug', { jobs: jobDtos })
})

router.get('/:jobId', async (req, res) => {
  const jobId = req.params['jobId']
  const status = getJob(jobId)
  if (!status) {
    return res.status(404).send()
  }
  const jobsDto = []
  for (const jobId of Object.keys(status)) {
    const job = status[jobId]
    const jobDto = {
      jobId,
      hasFinished: job?.hasFinished,
      details: new Array(),
    }
    for (const ip of Object.keys(job?.status ?? {})) {
      const jobIpStatus = {
        ip,
        success: job?.status?.ip?.success ?? false,
        message: job?.status?.ip?.message ?? '',
        output: job?.status?.ip?.output ?? '',
      }
      jobDto.details.push(jobIpStatus)
    }
    jobsDto.push(jobDto)
  }
  return res.render('jobdetails.pug', { jobs: jobsDto })
})

export default router
