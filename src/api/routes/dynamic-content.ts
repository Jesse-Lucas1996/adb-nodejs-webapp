import express from 'express'
import { repo } from '../../database'
import { DynamicContent } from '../../database/repo/dynamic-content'

const router = express.Router()

router.get('/', async (_req, res) => {
  const content = await repo.dynamicContent.getAll()
  res.status(200).send({ content })
})

router.get('/:id', async (req, res) => {
  const id = req.params.id
  const content = await repo.dynamicContent.get(id)
  res.status(200).send({ content })
})

router.post('/', async (req, res) => {
  const body = req.body as { content: DynamicContent }
  if (
    !(
      body?.content?.title &&
      body?.content?.type &&
      body?.content?.url &&
      body?.content?.id
    )
  ) {
    return res.status(400).send({ message: 'Content field(s) missing' })
  }

  const updated = await repo.dynamicContent.update({
    id: body.content.id,
    type: body.content.type,
    title: body.content.title,
    url: body.content.url,
  })

  return res.status(201).send({ content: updated })
})

router.delete('/:id', async (req, res) => {
  const id = req.params.id
  await repo.dynamicContent.remove(id)
  res.status(204).send()
})

export default router
