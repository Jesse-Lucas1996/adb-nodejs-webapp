import express from 'express'
import { createJob } from '../../job'
import { createTask } from '../../task'
import { v4 as uuid } from 'uuid'
import { pool } from '../../adb'
import { repo } from '../../database'

const router = express.Router()
router.post('/', async (req, res) => {
  const body = req.body as EmergencyBody

  const serials =
      body.cmd === 'sendTo'
        ? body.target
        : (await repo.assets.get()).map(a => a.serial),
    task = createTask('sendEmergency'),
    jobId = uuid(),
    job = createJob(jobId, task, serials, 'emergency')

  job.start(pool)

  return res.status(200).send({ jobId })
})

type EmergencyBody =
  | {
      cmd: 'sendAll'
    }
  | {
      cmd: 'sendTo'
      target: string[]
    }

export default router
