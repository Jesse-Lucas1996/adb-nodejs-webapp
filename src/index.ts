import { pool } from './adb'
import app from './create-server'
import path from 'path'
import { createLogger } from './shared/logger'
import { services } from './services'

const [host, port] = ['localhost', 3000]
const logger = createLogger('application')

pool.start()
services.candidateScanner.start()
services.screenState.start()
services.usageState.start()

app.set('views', path.join(__dirname, './website/views'))
app.set('view engine', 'pug')
app.listen(port, () => {
  logger.info(`listening at ${host}:${port}`)
})
