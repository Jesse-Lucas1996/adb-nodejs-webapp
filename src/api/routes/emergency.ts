import express from 'express'
import { emergency } from '../../services'

const router = express.Router()

router.get('/', async (_req, res) => {
  const { isActive } = emergency.status()
  return res.status(200).send({ isActive })
})

router.post('/', async (req, res) => {
  const body = req.body as EmergencyBody

  if (
    !(body.hasOwnProperty('setActive') && typeof body.setActive === 'boolean')
  ) {
    return res.status(400).send()
  }

  const execute = body.setActive ? emergency.start : emergency.stop
  execute()
  const { isActive } = emergency.status()

  return res.status(200).send({ isActive })
})

type EmergencyBody = {
  setActive: boolean
}

export default router
