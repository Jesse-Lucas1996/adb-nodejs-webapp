import express from 'express'
import baseRouter from './api/routes'
import cors from 'cors'
import axios from 'axios'
import { errorMiddleware } from './api/middleware/error'
import websiteRouter from './website/routes'
const app = express()

export const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: { 'x-api-key': 'API_KEY_HERE', 'Content-Type': 'application/json' },
})

app.use(cors())
app.use(express.json())
app.use('/api', baseRouter)
app.use('/', websiteRouter)
app.use(errorMiddleware)
export default app
