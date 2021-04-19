import express from 'express'
import { doWork } from '../../connect'
const router = express.Router()

// router.get('/', async (_req, res) => {
//   res.send(doWork('not implemented'))
// })
router.post('/', async (req, res) => {
  const body = req.body as EmergencyBody
  switch (body.cmd) {
    case 'sendAll':
      return res.status(404).send('Not implemented yet')

    case 'sendTo':
      const ips = body.target
      for (const ip of ips) {
        // await doWork(ip, 'sendEmergency')
        doWork(ip, 'uptime')
      }
      return res.status(200).send('ok')

    case 'resetAll':
      return res.status(200).send('ok')

    case 'reset':
      const ips2 = body.target
      for (const ip of ips2) {
        doWork(ip, 'reset')
      }
      return res.status(200).send('ok')

    default:
      return res.status(404).send('Wrong command')
  }
  return res.status(404).send('Wrong request')
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
