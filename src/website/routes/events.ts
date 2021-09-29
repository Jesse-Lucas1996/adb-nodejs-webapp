import Router from 'express-promise-router'
import { PersistedScreenStateEvent } from '../../services/screen-state'
import { PersistedUsageStateEvent } from '../../services/usage-state'
import { api, makeRange } from '../utils'

const router = Router()

router.get('/screen-state', async (req, res) => {
  const query = req.query as {
    page?: number
    size?: number
    serial?: string
  }

  const resp = await api.get<{
    events: PersistedScreenStateEvent[]
    pages: number
    page: number
    size: number
    serial: string
  }>(
    `/events/screen-state?page=${query.page}&size=${query.size}&serial=${query.serial}`
  )

  const data = resp.data

  res.render('events/screen-state.pug', {
    events: data.events,
    page: data.page,
    size: data.size,
    serial: data.serial,
    pagesRange: makeRange(data.pages),
  })
})

router.get('/usage-state', async (req, res) => {
  const query = req.query as {
    page?: number
    size?: number
    serial?: string
  }

  const resp = await api.get<{
    events: PersistedUsageStateEvent[]
    pages: number
    page: number
    size: number
    serial: string
  }>(
    `/events/usage-state?page=${query.page}&size=${query.size}&serial=${query.serial}`
  )

  const data = resp.data

  res.render('events/usage-state.pug', {
    events: data.events,
    page: data.page,
    size: data.size,
    serial: data.serial,
    pagesRange: makeRange(data.pages),
  })
})

export default router
