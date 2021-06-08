import { Router } from 'express'
import healthCheckRouter from './healthcheck'
import jobPageRouter from './jobpage'
import homePageRouter from './homepage'
import authRouter from './auth'
import scannerSettingsRouter from './scanner-settings'
import logsRouter from './logs'
import { createCookieAuth } from '../../api/middleware/cookie-auth'
import { asyncHandler } from '../../api/middleware'
import passwordRouter from './password'
import emergencyRouter from './emergency'
import candidateScannerRouter from './candidate-scanner'
import assetRouter from './asset-page'

const router = Router()
const cookieAuth = createCookieAuth('admin')

router.use('/', asyncHandler(homePageRouter))
router.use('/auth', asyncHandler(authRouter))
router.use(asyncHandler(cookieAuth))
router.use('/password', asyncHandler(passwordRouter))
router.use('/jobpage', asyncHandler(jobPageRouter))
router.use('/homepage', asyncHandler(homePageRouter))
router.use('/jobs', asyncHandler(jobPageRouter))
router.use('/healthcheckpage', asyncHandler(healthCheckRouter))
router.use('/scanner', asyncHandler(scannerSettingsRouter))
router.use('/emergency', asyncHandler(emergencyRouter))
router.use('/logs', asyncHandler(logsRouter))
router.use('/candidates', asyncHandler(candidateScannerRouter))
router.use('/assets', asyncHandler(assetRouter))

export default router
