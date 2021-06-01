import express from 'express'
import { repo } from '../../database'

const router = express.Router()

router.get('/', async (_req, res) => {
  const candidates = repo.ipScannerCandidates.get()
  res.status(200).send({ candidates })
})

export default router
