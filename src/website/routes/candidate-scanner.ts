import express from 'express'
import { api } from '../utils'

const router = express.Router()

router.get('/', async (_req, res) => {
  const resp = await api.get('/candidates')
  const { candidates } = resp.data as { candidates: string[] }

  res.render('candidates.pug', { candidates })
})

export default router
