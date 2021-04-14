import express from 'express'
const router = express.Router({})

router.get('/', async (_, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
  }

  res.send(healthcheck)
})

export default router
