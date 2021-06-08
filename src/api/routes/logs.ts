import express from 'express'
import { repo } from '../../database'
const router = express.Router({})

router.get('/', async (req, res) => {
  const query = req.query as {
    page?: number
    size?: number
    name?: string
    level?: string
  }

  const page = +(query.page || 0) || 1,
    size = +(query.size || 0) || 50,
    name = query.name === 'undefined' ? undefined : query.name,
    level = query.level === 'undefined' ? undefined : query.level

  const resp = await repo.logs.getPaginated({
    page,
    size,
    name,
    level,
  })
  return res.send({ ...resp, name, level })
})

export default router
