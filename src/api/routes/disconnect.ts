import Router from 'express-promise-router'
import adb from '@devicefarmer/adbkit'
const router = Router()
const client = adb.createClient()

router.post('/disconnect', async (req, res) => {
  const body = req.body as Disconnect
  const PORT = 5555
  switch (body.cmd) {
    case 'sendAll':
      const ipa = body.target
      for (const ip of ipa) {
        client
          .disconnect(`${ip}:${PORT}`)
          .catch(ex =>
            console.warn('Disconnection error for device', ip, 'Details', ex)
          )
      }
      return res.status(100).send('ok')

    case 'sendTo':
      const ips = body.target
      for (const ip of ips) {
        client
          .disconnect(`${ip}:${PORT}`)
          .catch(ex =>
            console.warn('Disconnection error for device', ip, 'Details', ex)
          )
      }
      return res.status(200).send('ok')

    default:
      return res.status(404).send('Wrong command')
  }
})

type Disconnect =
  | {
      cmd: 'sendAll'
      target: string[]
    }
  | {
      cmd: 'sendTo'
      target: string[]
    }

export default router
