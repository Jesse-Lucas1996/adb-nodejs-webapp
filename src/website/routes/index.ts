import Router from 'express-promise-router'
import healthCheckRouter from './healthcheck'
import jobPageRouter from './jobs'
import deviceRouter from './devices'
import authRouter from './auth'
import scannerSettingsRouter from './scanner-settings'
import logsRouter from './logs'
import { createCookieAuthMiddleware } from '../../api/middleware/cookie-auth-middleware'
import { asyncHandler } from '../../api/middleware'
import passwordRouter from './password'
import emergencyRouter from './emergency'
import candidateScannerRouter from './candidate-scanner'
import assetRouter from './assets'
import eventsRouter from './events'
import userguideRouter from './user-guide'
import tasksRouter from './tasks'
import applicationsRouter from './applications'
import packageRouter from './packages'
import dynamicContentRouter from './dynamic-content'
import publicRouter from './public'
import setupWizard from './setup-wizard'

const router = Router()
const cookieAuth = createCookieAuthMiddleware('admin')

router.use('/', asyncHandler(userguideRouter))
router.use('/user-guide', asyncHandler(userguideRouter))
router.use('/auth', asyncHandler(authRouter))
router.use('/public', asyncHandler(publicRouter))

router.use(cookieAuth)
router.use('/password', asyncHandler(passwordRouter))
router.use('/devices', asyncHandler(deviceRouter))
router.use('/jobs', asyncHandler(jobPageRouter))
router.use('/healthcheckpage', asyncHandler(healthCheckRouter))
router.use('/scanner', asyncHandler(scannerSettingsRouter))
router.use('/emergency', asyncHandler(emergencyRouter))
router.use('/logs', asyncHandler(logsRouter))
router.use('/candidates', asyncHandler(candidateScannerRouter))
router.use('/assets', asyncHandler(assetRouter))
router.use('/events', asyncHandler(eventsRouter))
router.use('/tasks', asyncHandler(tasksRouter))
router.use('/applications', asyncHandler(applicationsRouter))
router.use('/packages', asyncHandler(packageRouter))
router.use('/dynamic-content', asyncHandler(dynamicContentRouter))
router.use('/setup-wizard', asyncHandler(setupWizard))
export default router
