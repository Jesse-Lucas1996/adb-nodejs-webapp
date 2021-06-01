import { Router } from 'express'
import healthCheckRouter from './healthcheck'
import jobPageRouter from './jobpage'
import homePageRouter from './homepage'
import authRouter from './auth'
import scannerSettingsRouter from './scanner-settings'
import { createCookieAuth } from '../../api/middleware/cookie-auth'
import { asyncHandler } from '../../api/middleware'
import passwordRouter from './password'
import emergencyRouter from './emergency'
import jobDetailsRouter from './job-details'

const router = Router()
const cookieAuth = createCookieAuth('admin')

router.use('/', asyncHandler(homePageRouter))
router.use('/auth', asyncHandler(authRouter))
router.use(asyncHandler(cookieAuth))
router.use('/password', asyncHandler(passwordRouter))
router.use('/jobpage', asyncHandler(jobPageRouter))
router.use('/homepage', asyncHandler(homePageRouter))
router.use('/jobs', asyncHandler(jobPageRouter))
router.use('/:jobId', asyncHandler(jobDetailsRouter))
router.use('/healthcheckpage', asyncHandler(healthCheckRouter))
router.use('/scanner', asyncHandler(scannerSettingsRouter))
router.use('/emergency', asyncHandler(emergencyRouter))
export default router
