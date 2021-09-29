import Router from 'express-promise-router'
import { repo } from '../../database'
import { DeviceAsset } from '../../database/repo/device-assets'
import { ApplicationError } from '../../types'
import { api } from '../utils'

type DeviceAssetsBody = {
  serial: string[]
  name: string[]
}

const router = Router()

router.get('/', async (_req, res) => {
  const assets = await repo.assets.get()
  res.render('assets.pug', { assets: assets })
})

router.post('/', async (req, res) => {
  const body = req.body as DeviceAssetsBody

  try {
    const assets = toDeviceAssets(body)
    const resp = await api.post('/assets', { assets })

    if (resp.status !== 201) {
      return res.status(resp.status).send({ message: resp.data?.message })
    }

    return res.status(resp.status).redirect('/assets')
  } catch (ex) {
    return res.status(400).send({ message: 'Invalid Serial or Name' })
  }
})

function toDeviceAssets({ serial, name }: DeviceAssetsBody): DeviceAsset[] {
  if (serial.length !== name.length) {
    throw new ApplicationError('Invalid data, cannot proceed')
  }
  return serial.map((s, i) => {
    return {
      serial: s,
      name: name[i],
    }
  })
}

export default router
