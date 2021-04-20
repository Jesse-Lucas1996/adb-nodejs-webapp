import { Router } from 'express'
import healthcheckRouter from './health-check'
import emergencyRouter from './emergency'
import { asyncHandler } from '../middleware/async'
import { createApiKeyMiddleware } from '../middleware/authMiddleware'
import statusRouter from './uptime'
import disconnectRouter from './disconnect'
import poolRouter from './pool'

const router = Router()

router.use('/healthCheck', healthcheckRouter)
router.use(
  '/emergency',
  createApiKeyMiddleware('API_KEY_HERE'),
  asyncHandler(emergencyRouter)
)
router.use('/uptime', createApiKeyMiddleware('API_KEY_HERE'), statusRouter)
router.use(
  '/pool',
  createApiKeyMiddleware('API_KEY_HERE'),
  poolRouter,
  disconnectRouter
)

export default router
