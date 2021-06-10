import express from 'express'
import cookieParser from 'cookie-parser'
import { repo } from '../../database/index'

const router = express.Router()

router.use(cookieParser('user'))

router.get('/', async (_req, res) => {
  res.render('auth.pug')
})

router.post('/', async (req, res) => {
  const { username, password } = req.body

  const authentication = await repo.credentials.validate(username, password)

  if (!authentication.isValid) {
    const errorMessage = 'Wrong Username or Password'
    return res.render('auth.pug', { errorMessage })
  }

  res.cookie('user', username, {
    signed: true,
    httpOnly: true,
    domain: 'localhost',
    expires: new Date(new Date().setHours(new Date().getHours() + 1)),
  })
  return res.status(200).redirect('/')
})

export default router
