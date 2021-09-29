import Router from 'express-promise-router'
import { repo } from '../../database'
import { DeviceAsset } from '../../database/repo/device-assets'

const router = Router()

router.get('/', async (_req, res) => {
  const assets = await repo.assets.get()
  res.status(200).send({ assets })
})

router.post('/', async (req, res) => {
  const body = req.body as { assets: DeviceAsset[] }
  const assets = body.assets

  if (!(assets && Array.isArray(assets))) {
    return res.status(400).send({ message: 'Invalid property assets' })
  }

  const invalidAssets = assets.filter(a => !(a.serial && a.name))
  if (invalidAssets.length) {
    return res
      .status(400)
      .send({ message: 'Invalid assets', assets: invalidAssets })
  }

  const stored = await repo.assets.update(assets)
  return res.status(201).send({ assets: stored })
})

export default router
