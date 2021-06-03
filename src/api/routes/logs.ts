import express from 'express'
import { repo } from '../../database'
import { LogLevel } from '../../logger/types'
const router = express.Router({})

router.get('/', async (req, res) => {
  const { page, size, name, level } = req.query as {
    page?: number
    size?: number
    name?: string
    level?: LogLevel
  }

  const resp = repo.logs.get({
    page: page ?? 1,
    size: size ?? 50,
    name: name,
    level: level,
  })
  return res.send(resp)
})

export default router
