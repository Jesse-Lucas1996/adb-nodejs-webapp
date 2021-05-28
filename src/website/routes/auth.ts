import express from 'express'
import cookieParser from 'cookie-parser'
import { repo } from '../../database/index'
const router = express.Router({})

router.use(cookieParser('user'))

router.get('/', async (_req, res) => {
  res.render('auth.pug')
})

router.post('/', async (req, res) => {
  const { username, password } = req.body

  if (!repo.userDb.validateCredentials(username, password).isValid) {
    return res.status(401).send()
  }

  res.cookie('user', username, {
    signed: true,
    maxAge: 864000,
    httpOnly: true,
  })
  return res.status(200).redirect('/')
})
export default router
