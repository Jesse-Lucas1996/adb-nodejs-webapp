import { Router } from 'express'
import healthcheckRouter from './health-check'

const router = Router()

router.use('/healthcheck', healthcheckRouter)

export default router
