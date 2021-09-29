import express from 'express'
import { repo } from '../../database'
import { api } from '../utils'
import { toScannerSettingsDto } from './scanner-settings'

const router = express.Router({})

router.get('/', async (_req, res) => {
  res.render('setup-wizard/welcome.pug')
})

router.get('/1', async (_req, res) => {
  const savedSettings = await repo.scannerSettings.get()
  const savedSettingsDto = toScannerSettingsDto(savedSettings)
  res.render('setup-wizard/step-1.pug', { scannerSettings: savedSettingsDto })
})

router.get('/2', async (_req, res) => {
  res.render('setup-wizard/step-2.pug')
})

router.get('/3', async (_req, res) => {
  const resp = await api.get('pool/status')
  const { status } = resp.data
  res.render('setup-wizard/step-3.pug', { status })
})

router.get('/4', async (_req, res) => {
  const assets = await repo.assets.get()
  res.render('setup-wizard/step-4.pug', { assets: assets })
})

router.get('/complete', async (_req, res) => {
  res.render('setup-wizard/complete.pug')
})

export default router
