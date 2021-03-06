import Router from 'express-promise-router'
import { api } from '../utils'

const router = Router()

router.get('/', async (_req, res) => {
  const resp = await api.get('pool/status')
  const { status } = resp.data

  res.render('devices/list.pug', { status })
})

router.get('/:serial', async (req, res) => {
  const serial = req.params['serial']
  const resp = await api.get(`devices/${serial}`)
  const { macAddress, ipAddress, upTime, versionOfAndroid, hasProvisioned } =
    resp.data

  return res.render('devices/details.pug', {
    serial,
    macAddress,
    ipAddress,
    upTime,
    versionOfAndroid,
    hasProvisioned,
  })
})

export default router
