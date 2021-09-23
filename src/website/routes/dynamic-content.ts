import express from 'express'
import { DynamicContent } from '../../database/repo/dynamic-content'
import { api } from '../utils'
import { v4 as uuid } from 'uuid'

const router = express.Router()

router.get('/', async (_req, res) => {
  const resp = await api.get<{ content: DynamicContent[] }>('dynamic-content'),
    { content } = resp.data

  return res.render('dynamic-content/list.pug', { content })
})

router.get('/create', async (_req, res) => {
  return res.render('dynamic-content/content.pug', {
    content: {
      id: uuid(),
      type: 'redirect',
      title: '',
      url: '',
    },
    deletable: false,
  })
})

router.get('/:id', async (req, res) => {
  const id = req.params.id,
    resp = await api.get<{ content: DynamicContent }>(`dynamic-content/${id}`),
    { content } = resp.data

  if (!content) {
    return res.status(404).send()
  }

  return res.render('dynamic-content/content.pug', {
    content,
    deletable: true,
  })
})

router.post('/', async (req, res) => {
  const content = req.body as DynamicContent,
    resp = await api.post('dynamic-content', { content })

  if (resp.status === 201) {
    return res.status(201).redirect('/dynamic-content')
  }
  return res.status(400).send()
})

router.post('/delete', async (req, res) => {
  const id = req.body.id,
    resp = await api.delete(`dynamic-content/${id}`)

  if (resp.status === 204) {
    return res.status(204).redirect('/dynamic-content')
  }
  return res.status(400).send()
})

export default router
