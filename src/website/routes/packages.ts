import Router from 'express-promise-router'
import { api } from '../utils'

const router = Router()

router.get('/', async (_req, res) => {
  const resp = await api.get('pool/status')
  const { status } = resp.data

  res.render('devices/list.pug', { status })
})

router.get('/:serial', async (req, res) => {
  const serial = req.params['serial']
  const resp = await api.get(`packages/${serial}`)
  const { packageList } = resp.data

  if (resp.status !== 200) {
    return res.status(400).send()
  }

  return res.render('devices/packages.pug', {
    packageList,
  })
})

export default router
