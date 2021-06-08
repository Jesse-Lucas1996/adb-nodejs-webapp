import express from 'express'
import { repo } from '../../database'

const router = express.Router()

router.get('/', async (_req, res) => {
  const candidates = await repo.connectionCandidates.get()
  res.status(200).send({ candidates })
})

export default router
