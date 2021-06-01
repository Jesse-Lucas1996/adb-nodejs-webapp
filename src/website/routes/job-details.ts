import express from 'express'
import { getJobs as jobsStatus } from '../../job'
const router = express.Router()

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
