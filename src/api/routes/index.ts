import Router from 'express-promise-router'
import { createApiKeyAuthMiddleware } from '../middleware/api-key-auth-middleware'
import { asyncHandler } from '../middleware/async-handler'

import healthcheckRouter from './health-check'
import emergencyRouter from './emergency'
import disconnectRouter from './disconnect'
import poolRouter from './pool'
import jobsRouter from './jobs'
import logsRouter from './logs'
import candidateScannerRouter from './candidate-scanner'
import assetsRouter from './assets'
import eventRouter from './events'
import tasksRouter from './tasks'
import devicesRouter from './devices'
import packagesRouter from './packages'
import { config } from '../../config'
import dynamicContentRouter from './dynamic-content'
import emergencyMessage from './emergency-message'

const router = Router()
const apiKeyMiddleware = createApiKeyAuthMiddleware(config.apiKey)

router.use('/healthcheck', healthcheckRouter)
router.use('/emergency/message', asyncHandler(emergencyMessage))
router.use(apiKeyMiddleware)

router.use('/emergency', asyncHandler(emergencyRouter))
router.use('/pool', asyncHandler(poolRouter), asyncHandler(disconnectRouter))
router.use('/jobs', asyncHandler(jobsRouter))
router.use('/logs', asyncHandler(logsRouter))
router.use('/candidates', asyncHandler(candidateScannerRouter))
router.use('/assets', asyncHandler(assetsRouter))
router.use('/events', asyncHandler(eventRouter))
router.use('/tasks', asyncHandler(tasksRouter))
router.use('/devices', asyncHandler(devicesRouter))
router.use('/packages', asyncHandler(packagesRouter))
router.use('/dynamic-content', asyncHandler(dynamicContentRouter))

export default router
