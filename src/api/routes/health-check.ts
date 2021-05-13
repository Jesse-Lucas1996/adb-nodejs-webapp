import express from 'express'
import { systemHealthCheck } from '../../healthcheck'
const router = express.Router({})

router.get('/', async (_req, res) => {
  const healthCheck = systemHealthCheck()

  return res.send({ healthCheck })
})

export default router
