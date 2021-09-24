import express from 'express'
import { services } from '../../services'
const router = express.Router()

router.get('/', async (_req, res) => {
  const message = services.emergency.getMessage()
  res.send({ message })
})

export default router
