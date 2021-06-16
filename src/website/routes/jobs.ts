import express from 'express'
import { api } from '../utils'
import { TaskResponse } from './tasks'

const router = express.Router()

router.get('/', async (_req, res) => {
  const resp = await api.get<{ jobs: [] }>('/jobs'),
    jobs = resp.data.jobs.reverse()

  res.render('jobs/list.pug', { jobs })
})

router.get('/create', async (_req, res) => {
  const resp = await api.get('pool/status')
  const { status } = resp.data

  res.render('jobs/create.pug', { status })
})

router.post('/', async (req, res) => {
  const body = req.body as {
    name: string
    task: string
    onSuccess: string
    onError: string
  } & { [K in string]: 'on' }

  try {
    const serials = Object.keys(body).reduce((acc, key) => {
      if (key.includes('serial-')) {
        const [_, serial] = key.split('-')
        acc = [...acc, serial]
      }
      return acc
    }, new Array<string>())

    const job = {
      name: body.name,
      taskId: body.task,
      onSuccessTaskId: body.onSuccess,
      onErrorTaskId: body.onError,
      serials,
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
  const tasksRes = await api.get<{ tasks: TaskResponse[] }>('/tasks'),
    tasks = tasksRes.data.tasks.map(t => t.taskId).reverse()

  const devicesRes = await api.get<{
    status: { [K in string]: { state: string; name: string } }
  }>('pool/status')
  const { status } = devicesRes.data

  const devices = Object.entries(status).reduce(
    (acc, [serial, { state, name }]) => {
      return (acc = [...acc, { serial, name, state }])
    },
    new Array<{
      serial: string
      name: string
      state: string
    }>()
  )

  res.render('jobs/create.pug', { tasks, devices })
})

router.get('/:jobId', async (req, res) => {
  const jobId = req.params['jobId'],
    resp = await api.get(`/jobs/${jobId}`),
    job = resp.data.job

  return res.render('jobs/job.pug', { job })
})

export default router
