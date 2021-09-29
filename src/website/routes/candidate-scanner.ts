import Router from 'express-promise-router'
import { api } from '../utils'

const router = Router()

router.get('/', async (_req, res) => {
  const resp = await api.get('/candidates')
  const { candidates } = resp.data as { candidates: string[] }

  res.render('candidates.pug', { candidates })
})

export default router
