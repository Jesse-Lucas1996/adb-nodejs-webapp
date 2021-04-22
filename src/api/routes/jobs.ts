import express from 'express'
import { getJobs as jobsStatus } from '../../job'

const router = express.Router()

router.get('/:jobId',  async (req, res) => {
  const jobId = req.params['jobId']
  return res.status(200).send({ jobs: jobsStatus(jobId) })
})

router.get('/',  async (_req, res) => {

  return res.status(200).send({ jobs: jobsStatus() })
})

export default router
