import { Router } from 'express'
import healthCheckRouter from './health-check'
import emergencyRouter from './emergency'
import { asyncHandler } from '../middleware/async'
import { readHeader } from '../middleware/auth-header'

const router = Router()

router.use('/healthCheck', healthCheckRouter)
router.use('/emergency', asyncHandler(emergencyRouter))
router.use('/readHeader', asyncHandler(readHeader))

export default router
