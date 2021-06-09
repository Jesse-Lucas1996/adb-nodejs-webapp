import NeDB from 'nedb-promises'
import { ScreenStateEvent } from '../../services/screen-state'

export type ScreenStateEventFilter = {
  page?: number
  size?: number
  serial?: string
}

type PaginatedEvents<T extends any> = {
  events: T[]
  pages: number
  page: number
  size: number
}

export function createScreenStateStore(path?: string) {
  const datastore = NeDB.create(path ?? './screen-state-es.db')

  const append = async (event: ScreenStateEvent) => {
    await datastore.insert(event)
  }

  const getPaginated = async (
    filter?: ScreenStateEventFilter
  ): Promise<PaginatedEvents<ScreenStateEvent>> => {
    filter ??= {}
    const query = {}

    if (filter?.serial) {
      query['serial'] = filter.serial
    }

    const page = +filter.page! ?? 1
    const size = +filter.size! ?? 50

    const count = await datastore.count(query)
    const pages = Math.ceil(count / size)

    const documents = await datastore
      .find<ScreenStateEvent>(query, { _id: 0 })
      .sort({ timestamp: -1 })
      .skip(page - 1)
      .limit(size)

    return {
      events: documents,
      pages,
      page,
      size,
    }
  }

  return {
    append,
    getPaginated,
  }
}
