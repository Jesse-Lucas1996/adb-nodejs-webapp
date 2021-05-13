import { pool } from './adb'
import app from './create-server'
import path from 'path'

const port = 3000
const host = 'localhost'

pool.start()

app.set('views', path.join(__dirname, './website/routes/views'))
app.set('view engine', 'pug')

app.listen(port, () => {
  console.log('listening at ', port, 'and the host is ', host)
})
