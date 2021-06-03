import express from 'express'
import { getJob, getJobs } from '../../job'

const router = express.Router()

router.get('/:jobId', async (req, res) => {
  const jobId = req.params['jobId']
  return res.status(200).send({ jobs: getJob(jobId) })
})

router.get('/', async (_req, res) => {
  const status = getJobs()

  return res.status(200).send({ jobs: status })
})

export default router
