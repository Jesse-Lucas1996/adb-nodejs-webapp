import express from 'express'
import { doWork } from '../../connect'
const router = express.Router()

router.post('/', async (req, res) => {
  const body = req.body as Status
  switch (body.cmd) {
    case 'sendAll':
      const ipa = body.target
      for (const ip of ipa) {
        doWork(ip, 'uptime')
      }
      return res.status(100).send('ok')

    case 'sendTo':
      const ips = body.target
      for (const ip of ips) {
        doWork(ip, 'uptime')
      }
      return res.status(200).send('ok')

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
