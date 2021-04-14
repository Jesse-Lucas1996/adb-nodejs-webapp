import express from 'express'
import { doWork } from '../../connect'
const router = express.Router({})

router.get('/', async (_req, res) => {
  res.send(doWork())
})
router.post('/', async (_req, res) => {
  res.send(doWork())
})
export default router
