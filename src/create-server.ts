import express from 'express'
import baseRouter from './api/routes'
import cookieParser from 'cookie-parser'
import path from 'path'

import cors from 'cors'
import { errorMiddleware } from './api/middleware/error'
import websiteRouter from './website/routes'

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api', baseRouter)
app.use(
  express.urlencoded({
    extended: true,
  })
)

const realPath = path.join(__dirname, './website/images')

app.use('/images', express.static(realPath))

app.use(cookieParser('SECRET_CHANGE_IT'))

app.use('/', websiteRouter)
app.use(errorMiddleware)
export default app
