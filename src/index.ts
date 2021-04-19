import { adbConnector } from './adb'
import app from './api/create-server'

const port = 3000

adbConnector.start()

app.listen(port, () => {
  console.log('listening at ', port)
})
