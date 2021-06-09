import { pool, candidateScanner } from './adb'
import app from './create-server'
import path from 'path'
import { createLogger } from './logger'
import { screenStateService } from './services'

const [host, port] = ['localhost', 3000]
const logger = createLogger('application')

pool.start()
candidateScanner.start()
screenStateService.start()

app.set('views', path.join(__dirname, './website/views'))
app.set('view engine', 'pug')
app.listen(port, () => {
  logger.info(`listening at ${host}:${port}`)
})
