import express from 'express'

const app = express()
const port = 3000

export function test() {
  app.get('/', (_req, res) => {
    res.send('Hello World!')
  })

  app.listen(port, () => {
    console.log('listening at ', port)
  })
}
