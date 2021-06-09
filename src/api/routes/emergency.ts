import express from 'express'
import { services } from '../../services'

const router = express.Router()

router.get('/', async (_req, res) => {
  const { isActive } = services.emergency.status()
  return res.status(200).send({ isActive })
})

router.post('/', async (req, res) => {
  const body = req.body as EmergencyBody

  if (
    !(body.hasOwnProperty('setActive') && typeof body.setActive === 'boolean')
  ) {
    return res.status(400).send()
  }

  const execute = body.setActive
    ? services.emergency.start
    : services.emergency.stop
  execute()
  const { isActive } = services.emergency.status()

  return res.status(200).send({ isActive })
})

type EmergencyBody = {
  setActive: boolean
}

export default router
