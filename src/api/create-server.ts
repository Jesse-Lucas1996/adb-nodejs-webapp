import express from 'express'
//import { errorMiddleware, logMiddleware } from './middleware'
import baseRouter from './routes'
var cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api', baseRouter)

export default app
