import Router from 'express-promise-router'
import { pool } from '../../adb/index'

const router = Router()

router.get('/status', async (_req, res) => {
  const status = await pool.getState()
  res.status(200).send({ status })
})

export default router
