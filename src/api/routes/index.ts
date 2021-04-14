import { Router } from 'express'
import healthcheckRouter from './health-check'
import emergencyRouter from './emergency'
import { asyncHandler } from '../middleware/async'

const router = Router()

router.use('/healthcheck', healthcheckRouter)
router.use('/emergency', asyncHandler(emergencyRouter))

export default router
