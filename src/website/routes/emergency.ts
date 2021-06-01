import express from 'express'
import { api } from '.././utils'
const router = express.Router({})

router.get('/', async (_req, res) => {
  res.render('emergency.pug')
})

router.post('/', async (req, res) => {
  const submit = req.body
  if (submit) {
    const data = { cmd: 'sendTo', target: ['10.100.114.77:5555'] }
    const resp = await api.post('/emergency', data)
    const jobId = resp.data?.jobId

    if (!jobId) {
      return res.status(404).send()
    }
    return res.redirect(`/jobs/${jobId}`)
  }
})

export default router
