import express from 'express'
import { store } from '../../database'
const router = express.Router({})

router.get('/screen-state', async (req, res) => {
  const query = req.query as {
    page?: number
    size?: number
    serial?: string
  }

  const page = +(query.page || 0) || 1,
    size = +(query.size || 0) || 50,
    serial = query.serial === 'undefined' ? undefined : query.serial

  const resp = await store.screenState.getPaginated({
    page,
    size,
    serial,
  })
  return res.send({ ...resp, serial })
})

router.get('/usage-state', async (req, res) => {
  const query = req.query as {
    page?: number
    size?: number
    serial?: string
  }

  const page = +(query.page || 0) || 1,
    size = +(query.size || 0) || 50,
    serial = query.serial === 'undefined' ? undefined : query.serial

  const resp = await store.usageState.getPaginated({
    page,
    size,
    serial,
  })
  return res.send({ ...resp, serial })
})

export default router
