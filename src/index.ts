import { pool } from './adb'
import app from './create-server'
import path from 'path'
import { createLogger } from './logger'

const port = 3000
const host = 'localhost'
const logger = createLogger('application')

pool.start()

app.set('views', path.join(__dirname, './website/routes/views'))
app.set('view engine', 'pug')

app.listen(port, () => {
  logger.info(`listening at ${host}:${port}`)
})
