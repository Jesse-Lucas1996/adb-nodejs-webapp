import express from 'express'
import { LogEntry } from '../../logger/types'
import { api } from '../utils'

const router = express.Router({})

router.get('/', async (_req, res) => {
  const resp = await api.get('/logs')
  const { logs, pages } = resp.data as { logs: LogEntry[]; pages: number }

  res.render('logs.pug', { logs, pages })
})

export default router
