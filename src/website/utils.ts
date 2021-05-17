import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: { 'x-api-key': 'API_KEY_HERE', 'Content-Type': 'application/json' },
})
