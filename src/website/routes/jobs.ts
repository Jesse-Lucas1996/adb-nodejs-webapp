import express from 'express'
import { api } from '../utils'
import { TaskResponse } from './tasks'

const router = express.Router()

router.get('/', async (_req, res) => {
  const resp = await api.get<{ jobs: [] }>('/jobs'),
    jobs = resp.data.jobs.reverse()

  res.render('jobs/list.pug', { jobs })
})

router.post('/', async (req, res) => {
  const body = req.body as {
    name: string
    task: string
    onSuccess: string
    onError: string
  }

  try {
    const job = {
      name: body.name,
      taskId: body.task,
      onSuccessTaskId: body.onSuccess,
      onErrorTaskId: body.onError,
    }
    const resp = await api.post<{ jobId: string }>('/jobs', job)

    if (resp.status !== 201) {
      throw new Error('Invalid API response')
    }
    return res.status(201).redirect(`/jobs/${resp.data.jobId}`)
  } catch (ex) {
    return res.status(400).send()
  }
})

router.post('/create', async (_req, res) => {
  const resp = await api.get<{ tasks: TaskResponse[] }>('/tasks'),
    tasks = resp.data.tasks.map(t => t.taskId).reverse()

  res.render('jobs/create.pug', { tasks })
})

router.get('/:jobId', async (req, res) => {
  const jobId = req.params['jobId'],
    resp = await api.get(`/jobs/${jobId}`),
    job = resp.data.job

  return res.render('jobs/job.pug', { job })
})

export default router
