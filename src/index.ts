import { pool } from './adb'
import app from './api/create-server'
import path from 'path'
import axios from 'axios'
const port = 3000
const host = 'localhost'


pool.start()

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, "views"))

app.get('/', async (_req,res)=>{
  const result = await axios({method: 'post', url: 'localhost:3000/api/pool'})
  res.render('homepage.pug', { status: result})
})


app.listen(port, () => {
  console.log('listening at ', port, 'and the host is ', host)
})


