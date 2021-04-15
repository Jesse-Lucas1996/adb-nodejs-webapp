import { Router } from 'express'
import healthCheckRouter from './health-check'
import emergencyRouter from './emergency'
import { asyncHandler } from '../middleware/async'
import { authMiddleware } from '../middleware/authMiddleware'

const router = Router()

<<<<<<< HEAD
router.use('/healthCheck', healthCheckRouter)
router.use('/emergency', asyncHandler(emergencyRouter))
router.use('/readHeader', asyncHandler(readHeader))
=======
router.use('/healthcheck', healthcheckRouter)
router.use('/emergency', authMiddleware, asyncHandler(emergencyRouter))
>>>>>>> for you calum

export default router
