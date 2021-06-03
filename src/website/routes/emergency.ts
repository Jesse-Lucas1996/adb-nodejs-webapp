import express from 'express'
import { api } from '.././utils'
const router = express.Router({})

router.get('/', async (_req, res) => {
  res.render('emergency.pug')
})

router.post('/', async (_req, res) => {
  const data = { cmd: 'sendAll' },
    resp = await api.post('/emergency', data),
    jobId = resp.data.jobId

  return res.redirect(`/jobs/${jobId}`)
})

export default router
