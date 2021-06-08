import express from 'express'
import { createJob } from '../../job'
import { createTask } from '../../task'
import { v4 as uuid } from 'uuid'
import { pool } from '../../adb'
import { repo } from '../../database'

const router = express.Router()

router.post('/', async (req, res) => {
  const body = req.body as Status

  const serials =
      body.cmd === 'sendTo'
        ? body.target
        : (await repo.assets.get()).map(a => a.serial),
    task = createTask('uptime'),
    jobId = uuid(),
    job = createJob(jobId, task, serials, 'uptime')

  job.start(pool)

  return res.status(200).send({ jobId })
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
