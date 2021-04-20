import express from 'express'
import { pool } from '../../adb/index'

const router = express.Router()

router.get('/status', async (_req, res) => {
  const status = pool.getStatus()
  res.status(200).send({ status })
})

export default router
