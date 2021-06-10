import { Router } from 'express'
import { createApiKeyAuthMiddleware } from '../middleware/api-key-auth-middleware'
import { asyncHandler } from '../middleware/async-handler'

import healthcheckRouter from './health-check'
import emergencyRouter from './emergency'
import statusRouter from './uptime'
import disconnectRouter from './disconnect'
import poolRouter from './pool'
import jobsRouter from './jobs'
import logsRouter from './logs'
import candidateScannerRouter from './candidate-scanner'
import assetsRouter from './device-assets'
import eventRouter from './events'

const router = Router()
const apiKeyMiddleware = createApiKeyAuthMiddleware('API_KEY_HERE')

router.use('/healthcheck', healthcheckRouter)

router.use(apiKeyMiddleware)

router.use('/emergency', asyncHandler(emergencyRouter))
router.use('/uptime', asyncHandler(statusRouter))
router.use('/pool', asyncHandler(poolRouter), asyncHandler(disconnectRouter))
router.use('/jobs', asyncHandler(jobsRouter))
router.use('/logs', asyncHandler(logsRouter))
router.use('/candidates', asyncHandler(candidateScannerRouter))
router.use('/assets', asyncHandler(assetsRouter))
router.use('/events', asyncHandler(eventRouter))

export default router
