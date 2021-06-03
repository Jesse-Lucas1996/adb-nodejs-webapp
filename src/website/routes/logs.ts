import express from 'express'
import { LogEntry, LogLevel } from '../../logger/types'
import { api } from '../utils'

const router = express.Router()

router.get('/', async (req, res) => {
  const query = req.query as {
    page?: number
    size?: number
    name?: string
    level?: LogLevel
  }

  const resp = await api.get(
    `/logs?page=${query.page ?? 1}&size=${query.size ?? 50}&name=${
      query.name ?? ''
    }&level=${query.level ?? ''}`
  )

  const { logs, pages } = resp.data as {
    logs: LogEntry[]
    pages: number
  }

  res.render('logs.pug', {
    logs,
    name: query.name,
    level: query.level,
    size: query.size || 50,
    pagesRange: makeRange(pages),
  })
})

function makeRange(n: number) {
  const range = []
  for (let i = 0; i < n; i++) {
    range.push(i + 1)
  }
  return range
}

export default router
