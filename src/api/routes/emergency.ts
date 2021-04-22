import express from 'express'
import { createJob, registerJob } from '../../job'
import { createTask } from '../../task'
import { v4 as uuid } from 'uuid'
import { pool } from '../../adb'

const router = express.Router()
router.post('/', async (req, res) => {
  const body = req.body as EmergencyBody
  switch (body.cmd) {
    case 'sendAll':
    return res.status(200).send('not implemented')

    case 'sendTo': {
      const ips = body.target,
        task = createTask('sendEmergency'),
        jobId = uuid(),
        job = createJob(jobId, ips, task)

      registerJob(job)
      job.start(pool.client)
      return res.status(200).send({ jobId })
    }

    case 'resetAll': {
      return res.status(404).send('Not implemented yet')
    }

    case 'reset':
      return res.status(404).send('Not implemented yet')

    default:
      return res.status(404).send('Wrong command')
  }
})


type EmergencyBody =
  | {
      cmd: 'sendAll'
 
    }
  | {
      cmd: 'sendTo'
      target: string[]
    }
  | {
      cmd: 'resetAll'
      targets: string[]
    }
  | {
      cmd: 'reset'
      target: string[]
    }

export default router
