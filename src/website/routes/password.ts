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

  if (!repo.userDb.validateCredentials('admin', originalPassword).isValid) {
    return res.status(401).send()
  }

  if (password === confirmPassword) {
    repo.userDb.updateCredentials(password)
    res.clearCookie('user')
    return res.status(200).redirect('/')
  }
})

export default router
