export type PersistedEvent<TEvt extends any> = {
  serial: string
  timestamp: string
  metadata?: any
} & (
  | {
      event: TEvt
    }
  | {
      error: 'deserialization' | 'connection'
      errorMessage: string
    }
)

export type PaginatedEvents<T extends any> = {
  events: T[]
  pages: number
  page: number
  size: number
}

export type EventFilter = {
  page?: number
  size?: number
  serial?: string
}
