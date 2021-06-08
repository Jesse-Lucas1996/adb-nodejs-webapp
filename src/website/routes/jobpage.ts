import express from 'express'
import { Jobs } from '../../types'
import { api } from '.././utils'
import { getJobs as jobsStatus } from '../../job'

const router = express.Router({})

router.get('/', async (_req, res) => {
  const resp = await api.get('/jobs')
  const jobs = resp.data.jobs as Jobs

  const jobsDto = []
  for (const jobId of Object.keys(jobs)) {
    const job = jobs[jobId]

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

  res.render('jobpage.pug', { jobs: jobsDto })
})

router.get('/:jobId', async (req, res) => {
  const jobId = req.params['jobId']

  const status = jobsStatus(jobId)
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
  res.render('jobdetails.pug', { jobs: jobsDto })
})

export default router
