import express from 'express'
const router = express.Router({})

router.get('/', async (_req, res) => {
  const healthCheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: new Date().toISOString(),
  }

  return res.send({ healthCheck })
})

export default router
