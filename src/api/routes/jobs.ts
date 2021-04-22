import express from 'express'
import { jobs as jobsStatus } from '../../job'

const router = express.Router()

router.get('/', async (_req, res) => {
  res.status(200).send({ jobs: jobsStatus() })
})

export default router
