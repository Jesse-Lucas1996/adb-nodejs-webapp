import app from './create-server'
const port = 3000

export function test() {
  app.get('/emergency', (_req, res) => {
    res.send('HELP AN EMERGENCY')
  })

  app.listen(port, () => {
    console.log('listening at ', port)
  })
}
