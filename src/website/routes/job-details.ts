import express from 'express'
import { getJob } from '../../job'
const router = express.Router()

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
