export type LogLevel = 'error' | 'info' | 'debug' | 'warning'

export type LogEntry = {
  name: string
  level: LogLevel
  timestamp: string
  message: string
}
