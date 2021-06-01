import Database from 'simplest.db'
import { LogLevel } from '../logger/types'

type LogsFilter = {
  page: number
  size: number
}

export type LogEntry = {
  name: string
  level: LogLevel
  timestamp: string
  message: string
}

export function createLogsRepo(path?: string) {
  const db = new Database({
    path: path ?? './logs.db',
    type: 'SQLite',
    check: true,
    cacheType: 0,
  })

  const append = (entry: LogEntry): LogEntry => {
    const index = db.keys.length
    return db.set(`${index}`, entry)
  }

  const get = (filter?: LogsFilter): { logs: LogEntry[]; pages?: number } => {
    if (!filter) {
      return { logs: db.values }
    }

    const length = db.keys.length
    const pages = Math.ceil(length / filter.size)

    const from = (filter.page - 1) * filter.size
    const to = filter.page * filter.size

    const logs = db.values.slice(from, to)

    return {
      logs,
      pages,
    }
  }

  return {
    append,
    get,
  }
}
