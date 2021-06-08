import { repo } from '../database'
import { LogEntry, LogLevel } from './types'

export function createLogger(name: string) {
  const error = (msg: any) => {
    const entry = toLogEntry(name, 'error', msg)
    console.error(toConsoleEntry(entry))
    Promise.resolve(repo.logs.append(entry))
  }

  const info = (msg: any) => {
    const entry = toLogEntry(name, 'info', msg)
    console.info(toConsoleEntry(entry))
    Promise.resolve(repo.logs.append(entry))
  }

  const debug = (msg: any) => {
    const entry = toLogEntry(name, 'debug', msg)
    console.debug(toConsoleEntry(entry))
    Promise.resolve(repo.logs.append(entry))
  }

  const warning = (msg: any) => {
    const entry = toLogEntry(name, 'warning', msg)
    console.warn(toConsoleEntry(entry))
    Promise.resolve(repo.logs.append(entry))
  }

  return { error, info, debug, warning }
}

function toLogEntry(name: string, level: LogLevel, msg: any): LogEntry {
  const date = new Date()

  return {
    name,
    level,
    timestamp: date.toISOString(),
    message: JSON.stringify(msg),
  }
}

function toConsoleEntry(entry: LogEntry) {
  return {
    ...entry,
    timestamp: new Date(entry.timestamp).toLocaleString(),
  }
}
