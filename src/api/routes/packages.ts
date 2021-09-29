import Router from 'express-promise-router'
import { pool } from '../../adb/index'
import { executeShellCommand } from '../../adb/connection-pool'

const router = Router()

router.get('/', async (_req, res) => {
  const status = await pool.getState()
  res.status(200).send({ status })
})

router.get('/:serial', async (req, res) => {
  const serial = req.params['serial']

  const client = pool.getDeviceClient(serial)
  if (!client) {
    return res.status(400).send('Client does not exist')
  }
  const ipAddress = await executeShellCommand(
    client,
    'ip addr show wlan0 |grep inet'
  )
  const packageList = await executeShellCommand(
    client,
    'pm list packages |cut -f 2 -d ":"'
  )
  return res.status(200).send({
    ipAddress,
    packageList,
  })
})

export default router
