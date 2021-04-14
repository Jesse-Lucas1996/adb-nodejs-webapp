import express from 'express'
import baseRouter from './routes'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api', baseRouter)

export default app
