import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: { 'x-api-key': 'API_KEY_HERE', 'Content-Type': 'application/json' },
})

export function makeRange(n: number) {
  const range = []
  for (let i = 0; i < n; i++) {
    range.push(i + 1)
  }
  return range
}
