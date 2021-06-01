import express from 'express'
import { repo } from '../../database'
const router = express.Router({})

router.get('/', async (_req, res) => {
  const resp = repo.logs.get()
  return res.send(resp)
})

export default router
