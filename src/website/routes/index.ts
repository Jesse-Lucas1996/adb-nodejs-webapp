import { Router } from 'express'
import healthCheckRouter from './healthcheck'
import jobPageRouter from './jobpage'
import homePageRouter from './homepage'
import { asyncHandler } from '../../api/middleware'

const router = Router()

router.use('/', asyncHandler(homePageRouter))
router.use('/jobpage', asyncHandler(jobPageRouter))
router.use('/healthcheckpage', asyncHandler(healthCheckRouter))
export default router
