import app from './api/create-server'

const port = 3000

app.listen(port, () => {
  console.log('listening at ', port)
})
