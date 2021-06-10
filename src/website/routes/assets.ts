import express from 'express'
import { repo } from '../../database'
import { DeviceAsset } from '../../database/repo/device-assets'

type DeviceAssetsBody = {
  serial: string[]
  name: string[]
}

const router = express.Router()

router.get('/', async (_req, res) => {
  const assets = await repo.assets.get()
  res.render('assets.pug', { assets: assets })
})

router.post('/', async (req, res) => {
  const body = req.body as DeviceAssetsBody

  try {
    const assets = toDeviceAssets(body)
    const stored = await repo.assets.update(assets)
    return res.render('assets.pug', { assets: stored })
  } catch (ex) {
    return res.status(400).send({ message: JSON.stringify(ex) })
  }
})

function toDeviceAssets({ serial, name }: DeviceAssetsBody): DeviceAsset[] {
  if (serial.length !== name.length) {
    throw new Error('Invalid data, cannot proceed')
  }
  return serial.map((s, i) => {
    return {
      serial: s,
      name: name[i],
    }
  })
}

export default router
