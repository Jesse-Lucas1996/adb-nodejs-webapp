import express from 'express'
import { userDb } from '../../database/users'
import cookieParser from 'cookie-parser'
const router = express.Router({})

router.use(cookieParser('user'))

router.get('/', async (_req, res) => {
  res.render('auth.pug')
})

router.post('/', function (req, res) {
  const { username, password } = req.body

  const userExists = Object.keys(userDb).includes(username)

  if (!userExists) {
    return res.status(401).send()
  }
  const dbPassword = userDb[username]
  if (!dbPassword) {
    return res.status(403).send()
  }
  if (password === dbPassword) {
    res.cookie('user', username, {
      signed: true,
      maxAge: 864000,
      httpOnly: true,
    })
    return res.status(200).redirect('/homepage')
  } else {
    return res.status(401).send()
  }
})
export default router
