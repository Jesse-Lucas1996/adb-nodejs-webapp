import { Router } from 'express'
import healthcheckRouter from './health-check'
import emergencyRouter from './emegency'

const router = Router()

router.use('/healthcheck', healthcheckRouter)
router.use('/emergency', emergencyRouter)

export default router
