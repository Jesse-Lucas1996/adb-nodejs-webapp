import express from 'express'
import { LogEntry } from '../../logger/types'
import { api } from '../utils'

const router = express.Router()

router.get('/', async (req, res) => {
  const query = req.query as {
    page?: number
    size?: number
    name?: string
    level?: string
  }

  const resp = await api.get(
    `/logs?page=${query.page}&size=${query.size}&name=${query.name}&level=${query.level}`
  )

  const data = resp.data as {
    logs: LogEntry[]
    pages: number
    page: number
    size: number
    name: string
    level: string
  }

  res.render('logs.pug', {
    logs: data.logs,
    name: data.name,
    level: data.level,
    size: data.size,
    page: data.page,
    pagesRange: makeRange(data.pages),
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
