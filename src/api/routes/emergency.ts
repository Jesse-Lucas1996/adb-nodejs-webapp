import Router from 'express-promise-router'
import { services } from '../../services'

const router = Router()

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
  const message = body.message
  if (body.setActive) {
    services.emergency.start(message)
  } else {
    services.emergency.stop()
  }

  const { isActive } = services.emergency.status()

  return res.status(200).send({ isActive })
})

type EmergencyBody = {
  setActive: boolean
  message?: string
}

export default router
