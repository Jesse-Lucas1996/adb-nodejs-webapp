export function systemHealthCheck() {
  const date = new Date()
  return {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: date.toISOString(),
  }
}
