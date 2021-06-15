import express from 'express'
import { api } from '../utils'

export type TaskResponse = {
  taskId: string
  description: string
  unitsOfWork: { cmd: string }[]
}

const router = express.Router()

router.get('/', async (_req, res) => {
  const resp = await api.get<{ tasks: TaskResponse[] }>('/tasks')

  const tasks = resp.data.tasks.reverse()

  res.render('tasks/list.pug', {
    tasks,
  })
})

router.get('/:taskId', async (req, res) => {
  const taskId = req.params['taskId']
  if (!taskId) {
    return res.status(400).send()
  }
  const resp = await api.get<{ task?: TaskResponse }>(`/tasks/${taskId}`)

  const task = resp.data?.task

  return res.render('tasks/task.pug', {
    task,
  })
})

router.post('/', async (req, res) => {
  const body = req.body as {
    taskId: string
    description: string
    unitsOfWork: string[]
  }

  try {
    const task = {
      ...body,
      unitsOfWork: body.unitsOfWork.map(u => ({ cmd: u })),
    }
    const resp = await api.post('/tasks', task)

    if (resp.status !== 201) {
      throw new Error('Invalid API response')
    }
    return res.status(201).redirect('/tasks')
  } catch (ex) {
    return res.status(400).send()
  }
})

router.post('/create', async (_req, res) => {
  return res.render('tasks/task.pug', {
    task: {
      taskId: '',
      description: '',
      unitsOfWork: [],
    },
  })
})

export default router
