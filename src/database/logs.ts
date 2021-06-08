import NeDB from 'nedb-promises'
import { LogLevel } from '../logger/types'

export type LogFilter = {
  page?: number
  size?: number
  name?: string
  level?: string
}

export type LogEntry = {
  name: string
  level: LogLevel
  timestamp: string
  message: string
}

type PaginatedLogs = {
  logs: LogEntry[]
  pages: number
  page: number
  size: number
}

export function createLogsRepo(path?: string) {
  const datastore = NeDB.create(path ?? './logs.db')
  const namestore = NeDB.create(path ? `${path}-names.db` : './log-names.db')

  const append = async (entry: LogEntry): Promise<LogEntry> => {
    const document = await datastore.insert<LogEntry>({
      name: entry.name,
      level: entry.level,
      timestamp: entry.timestamp,
      message: entry.message,
    })
    const { name, level, timestamp, message } = document
    await namestore.update({ name }, { name }, { upsert: true })

    return {
      name,
      level,
      timestamp,
      message,
    }
  }

  const getPaginated = async (filter?: LogFilter): Promise<PaginatedLogs> => {
    filter ??= {}
    const query = {}
    if (filter?.level) {
      query['level'] = filter.level
    }
    if (filter?.name) {
      query['name'] = filter.name
    }

    const page = +filter.page! ?? 1
    const size = +filter.size! ?? 50

    const count = await datastore.count(query)
    const pages = Math.ceil(count / size)

    const documents = await datastore
      .find<LogEntry>(query, { _id: 0 })
      .sort({ timestamp: -1 })
      .skip(page - 1)
      .limit(size)

    return {
      logs: documents,
      pages,
      page,
      size,
    }
  }

  const names = async (): Promise<string[]> => {
    const names = await namestore.find<{ name: string }>({})
    return names.map(n => n.name)
  }

  return {
    append,
    getPaginated,
    names,
  }
}
