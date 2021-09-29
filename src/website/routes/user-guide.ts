import Router from 'express-promise-router'
import { repo } from '../../database'

const router = Router()

router.get('/', async (_req, res) => {
  const { addresses, networks, ranges } = await repo.scannerSettings.get()

  if (!(addresses.length || networks.length || ranges.length)) {
    return res.redirect('/setup-wizard')
  }

  return res.render('user-guide.pug')
})

export default router
