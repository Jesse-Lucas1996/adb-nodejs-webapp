import express from 'express'
import { api } from '.././utils'
const router = express.Router()

router.get('/', async (_req, res) => {
  const resp = await api.get<{ isActive: boolean }>('/emergency'),
    isActive = resp.data?.isActive

  return res.render('emergency.pug', { isActive })
})

router.post('/', async (req, res) => {
  const body = req.body as { set: 'start' | 'stop' }
  if (!body.hasOwnProperty('set')) {
    return res.redirect('/emergency')
  }

  const setActive = body.set === 'start',
    resp = await api.post<{ isActive: boolean }>('/emergency', { setActive }),
    isActive = resp.data?.isActive

  return res.render('emergency.pug', { isActive })
})

export default router
