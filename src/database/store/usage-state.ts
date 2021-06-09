import NeDB from 'nedb-promises'
import { PersistedUsageStateEvent } from '../../services/usage-state'
import { EventFilter, PaginatedEvents } from './types'

export function createUsageStateStore(path?: string) {
  const datastore = NeDB.create(path ?? './usage-state-es.db')

  const append = async (event: PersistedUsageStateEvent) => {
    await datastore.insert(event)
  }

  const getPaginated = async (
    filter?: EventFilter
  ): Promise<PaginatedEvents<PersistedUsageStateEvent>> => {
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
      .find<PersistedUsageStateEvent>(query, { _id: 0 })
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
