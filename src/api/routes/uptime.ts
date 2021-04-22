import express from 'express'
import { createJob, registerJob } from '../../job'
import { createTask } from '../../task'
import { v4 as uuid } from 'uuid'
import { pool } from '../../adb'

const router = express.Router()

router.post('/', async (req, res) => {
  const body = req.body as Status
  switch (body.cmd) {
    case 'sendAll': {
      return res.status(404).send('Not implemented yet')
    }

    case 'sendTo': {
      const ips = body.target,
        task = createTask('uptime'),
        jobId = uuid(),
        job = createJob(jobId, ips, task)

      registerJob(job)
      job.start(pool.client)
      return res.status(200).send({ jobId })
    }

    default:
      return res.status(404).send('Wrong command')
  }
})

type Status =
  | {
      cmd: 'sendAll'
      target: string[]
    }
  | {
      cmd: 'sendTo'
      target: string[]
    }

export default router
