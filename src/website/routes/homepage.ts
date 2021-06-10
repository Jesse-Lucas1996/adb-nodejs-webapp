import express from 'express'
import { api } from '.././utils'

const router = express.Router()

router.get('/', async (_req, res) => {
  const resp = await api.get('pool/status')
  const { status } = resp.data

  res.render('homepage.pug', { status })
})

export default router
