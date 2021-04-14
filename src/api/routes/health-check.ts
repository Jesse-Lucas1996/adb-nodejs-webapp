import express from 'express'
const router = express.Router({})

router.get('/', async (_, res) => {
  const healthCheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
  }

  res.send(healthCheck)
})

export default router
