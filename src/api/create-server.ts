import express from 'express'
import baseRouter from './routes'
import cors from 'cors'
import { errorMiddleware } from './middleware/error'
const app = express()

app.use(cors())
app.use(express.json())
app.use('/api', baseRouter)
app.use(errorMiddleware)
export default app
