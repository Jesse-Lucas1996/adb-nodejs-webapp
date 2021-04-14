import app from './create-server'
import { doWork } from '../connect'
const port = 3000

export function test() {
  app.get('/emergency', (_req, res) => {
    res.send(doWork())
  })

  app.listen(port, () => {
    console.log('listening at ', port)
  })
}
