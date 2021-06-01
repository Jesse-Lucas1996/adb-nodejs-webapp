import { Router } from 'express'
import { createApiKeyMiddleware } from '../middleware/authMiddleware'
import { asyncHandler } from '../middleware/async'
import healthcheckRouter from './health-check'
import emergencyRouter from './emergency'
import statusRouter from './uptime'
import disconnectRouter from './disconnect'
import poolRouter from './pool'
import jobsRouter from './jobs'
import logsRouter from './logs'


const router = Router()
const apiKeyMiddleware = createApiKeyMiddleware('API_KEY_HERE')

router.use('/healthCheck', healthcheckRouter)

router.use(apiKeyMiddleware)

router.use('/emergency', asyncHandler(emergencyRouter))
router.use('/uptime', asyncHandler(statusRouter))
router.use('/pool', asyncHandler(poolRouter), asyncHandler(disconnectRouter))
router.use('/jobs', asyncHandler(jobsRouter))
router.use('/logs', asyncHandler(logsRouter))


export default router
