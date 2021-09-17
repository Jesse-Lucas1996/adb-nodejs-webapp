import { repo } from '../../database'
import { LogEntry, LogLevel } from './types'

const DRAIN_TIMEOUT = 10 * 1000

const entries = new Array<LogEntry>()

const drain = () => {
  const spliced = entries.splice(0, entries.length)
  repo.logs
    .append(spliced)
    .then()
    .catch(ex => console.error('Write log error', ex))

  setTimeout(() => {
    drain()
  }, DRAIN_TIMEOUT)
}

drain()

export function createLogger(name: string) {
  const error = (...msg: any) => {
    const entry = toLogEntry(name, 'error', msg)
    console.error(toConsoleEntry(entry))
    entries.push(entry)
  }

  const info = (...msg: any) => {
    const entry = toLogEntry(name, 'info', msg)
    console.info(toConsoleEntry(entry))
    entries.push(entry)
  }

  const debug = (...msg: any) => {
    const entry = toLogEntry(name, 'debug', msg)
    console.debug(toConsoleEntry(entry))
    entries.push(entry)
  }

  const warning = (...msg: any) => {
    const entry = toLogEntry(name, 'warning', msg)
    console.warn(toConsoleEntry(entry))
    entries.push(entry)
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
