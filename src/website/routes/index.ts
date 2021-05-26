import { Router } from 'express'
import healthCheckRouter from './healthcheck'
import jobPageRouter from './jobpage'
import homePageRouter from './homepage'
import authRouter from './auth'
import scannerSettingsRouter from './scanner-settings'
import { createCookieAuth } from '../../api/middleware/cookie-auth'
import { asyncHandler } from '../../api/middleware'
import passwordRouter from './password'

const router = Router()
const cookieAuth = createCookieAuth('admin')
router.use('/', asyncHandler(homePageRouter))
router.use('/auth', asyncHandler(authRouter))
router.use(asyncHandler(cookieAuth))
router.use('/password', asyncHandler(passwordRouter))
router.use('/homepage', asyncHandler(homePageRouter))
router.use('/jobpage', asyncHandler(jobPageRouter))
router.use('/healthcheckpage', asyncHandler(healthCheckRouter))
router.use('/scanner', asyncHandler(scannerSettingsRouter))

export default router
