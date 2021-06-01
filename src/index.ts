import { pool, candidateScanner } from './adb'
import app from './create-server'
import path from 'path'
import { createLogger } from './logger'

const [host, port] = ['localhost', 3000]
const logger = createLogger('application')

candidateScanner.start()
pool.start()

app.set('views', path.join(__dirname, './website/routes/views'))
app.set('view engine', 'pug')
app.listen(port, () => {
  logger.info(`listening at ${host}:${port}`)
})
