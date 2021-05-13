export function systemHealthCheck() {
  return {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now().toLocaleString(),
  }
}
