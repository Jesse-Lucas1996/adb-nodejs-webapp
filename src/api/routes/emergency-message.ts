import Router from 'express-promise-router'
import { services } from '../../services'
const router = Router()

router.get('/', async (_req, res) => {
  const message = services.emergency.getMessage()
  res.send({ message })
})

export default router
