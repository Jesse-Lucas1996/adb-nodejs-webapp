import Router from 'express-promise-router'

const router = Router()

router.get('/', async (_req, res) => {
  res.render('user-guide.pug')
})

export default router
