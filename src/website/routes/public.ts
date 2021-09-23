import express from 'express'
import { DynamicContent } from '../../database/repo/dynamic-content'

import { api } from '../utils'

const router = express.Router()

router.get('/info-channel', async (_req, res) => {
  const resp = await api.get<{ content: DynamicContent[] }>('dynamic-content'),
    { content } = resp.data

  res.render('public/info-channel.pug', { content })
})

router.get('/info-channel/embedded-topic/:id', async (req, res) => {
  const id = req.params.id,
    resp = await api.get<{ content: DynamicContent }>(`dynamic-content/${id}`),
    { content } = resp.data

  if (!content) {
    return res.status(404).send()
  }

  return res.render('public/embedded-topic.pug', {
    url: content.url,
    title: content.title,
  })
})

export default router
