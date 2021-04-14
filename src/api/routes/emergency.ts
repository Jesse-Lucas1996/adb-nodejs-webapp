import express from 'express'
import { doWork } from '../../connect'
const router = express.Router()

router.get('/', async (_req, res) => {
  res.send(doWork('not implemented'))
})
router.post('/', async (req, res) => {
  const body = req.body as EmergencyBody
  switch (body.cmd) {
    case 'sendAll':
      res.status(404).send('Not implemented yet')
      break

    case 'sendTo':
      const ips = body.target
      for (const ip of ips) {
        await doWork(ip)
      }
      res.status(200).send('ok')
      break

    default:
      res.status(404).send('Wrong command')
      break
  }
  res.status(404).send('Wrong request')
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
