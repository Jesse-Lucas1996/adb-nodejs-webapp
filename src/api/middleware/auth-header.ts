import { config } from '../../../config'
import app from '../create-server'
config.apiKey

export function readHeader() {
  app.get('/', (req, res) => {
    const getApi = req.header('x-api-key')
    if (getApi != config.apiKey) {
      res.send('Error wrong key')
    }
  })
}
