import { pool } from './adb'
import app from './api/create-server'
import path from 'path'
const port = 3000
const host = 'localhost'


pool.start()

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, "views"))

app.get('/', (_req,res)=>{
  // we call our API
  const mockData = {
    '1.1.1.1': { state: 'connected' },
    '1.1.1.2': { state: 'disconnected' },
    '1.1.1.3': { state: 'connected' },
    '1.1.1.4': { state: 'disconnected' },
    '1.1.1.5': { state: 'connected' },
  }

  res.render('homepage.pug', { mockData: mockData })
})

app.listen(port, () => {
  console.log('listening at ', port, 'and the host is ', host)
})
