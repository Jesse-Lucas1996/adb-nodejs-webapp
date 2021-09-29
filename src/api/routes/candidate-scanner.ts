import Router from 'express-promise-router'
import { repo } from '../../database'

const router = Router()

router.get('/', async (_req, res) => {
  const candidates = await repo.connectionCandidates.get()
  res.status(200).send({ candidates })
})

export default router
