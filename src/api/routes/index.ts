import { Router } from 'express'
import healthcheckRouter from './health-check'
import emergencyRouter from './emergency'
import { asyncHandler } from '../middleware/async'
import { createApiKeyMiddleware } from '../middleware/authMiddleware'

const router = Router()

router.use('/healthCheck', healthCheckRouter)
router.use(
  '/emergency',
  createApiKeyMiddleware('API_KEY_HERE'),
  asyncHandler(emergencyRouter)
)

export default router
