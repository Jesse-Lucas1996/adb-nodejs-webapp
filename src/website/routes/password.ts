import express from 'express'
import cookieParser from 'cookie-parser'
import { repo } from '../../database/index'

const router = express.Router({})
router.use(cookieParser('user'))

router.get('/', async (_req, res) => {
  res.render('password.pug')
})

router.post('/', async (req, res) => {
  const { password, originalPassword, confirmPassword } = req.body

  if (!(password && confirmPassword && password === confirmPassword)) {
    return res.status(400).send()
  }

  const authentication = await repo.credentials.validate(
    'admin',
    originalPassword
  )
  if (!authentication.isValid) {
    return res.status(401).send()
  }

  await repo.credentials.update(password)
  res.clearCookie('user')
  return res.status(200).redirect('/')
})

export default router
