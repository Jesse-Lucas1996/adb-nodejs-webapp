import { api } from '.././utils'
import Router from 'express-promise-router'

const router = Router()

router.get('/', async (_req, res) => {
  const resp = await api.get('/healthcheck')
  const healthcheck = resp.data
  res.render('healthcheck.pug', { healthcheck })
})

export default router
