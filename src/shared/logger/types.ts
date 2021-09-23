import * as bunyan from 'bunyan'

export type LogLevel = bunyan.LogLevel

export type LogEntry = {
  name: string
  level: LogLevel
  timestamp: string
  message: string
}
