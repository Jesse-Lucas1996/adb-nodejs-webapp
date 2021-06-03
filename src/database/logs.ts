import Database from 'simplest.db'
import { LogLevel } from '../logger/types'

export type LogsFilter = {
  page: number
  size: number
  name?: string
  level?: string
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

    const values = db.values as LogEntry[]

    const filtered = values
      .filter(fpe => (filter.name ? fpe.name === filter.name : true))
      .filter(spe => (filter.level ? spe.level === filter.level : true))

    const length = filtered.length
    const pages = Math.ceil(length / filter.size)

    const from = (filter.page - 1) * filter.size
    const to = filter.page * filter.size

    const logs = filtered.slice(from, to)

    return {
      logs,
      pages,
    }
  }

  const getNames = (): string[] => {
    const set = new Set<string>()
    for (const { name } of db.values as LogEntry[]) {
      set.add(name)
    }
    return [...set]
  }

  return {
    append,
    get,
    getNames,
  }
}
