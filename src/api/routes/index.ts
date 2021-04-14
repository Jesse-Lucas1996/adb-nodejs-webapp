import { Router } from 'express'
import healthCheckRouter from './health-check'
import emergencyRouter from './emergency'
import { asyncHandler } from '../middleware/async'

const router = Router()

router.use('/healthCheck', healthCheckRouter)
router.use('/emergency', asyncHandler(emergencyRouter))

export default router
