import express from 'express'
import { repo } from '../../database'
import { DeviceAsset } from '../../database/repo/device-assets'

const router = express.Router()

router.get('/', async (_req, res) => {
  const assets = await repo.assets.get()
  res.status(200).send({ assets })
})

router.post('/', async (req, res) => {
  const body = req.body as { assets: DeviceAsset[] }
  const assets = body?.assets ?? []

  for (const asset of assets) {
    if (!(typeof asset.serial === 'string' && typeof asset.name === 'string')) {
      return res.status(400).send()
    }
  }

  const stored = await repo.assets.update(assets)
  return res.status(201).send({ assets: stored })
})

export default router
