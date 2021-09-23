import { api } from '.././utils'
import express from 'express'

const router = express.Router({})

router.get('/', async (_req, res) => {
  const resp = await api.get('/healthcheck')
  const healthcheck = resp.data
  res.render('healthcheck.pug', { healthcheck })
})

export default router
