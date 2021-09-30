import { createLogger } from '../logger'

type BrokerEvent = {
  type: string
}

type ConcreteEvent<TEvt extends BrokerEvent, T extends string> = Extract<
  TEvt,
  { type: T }
>

let brokerId = 0

export function createMessageBroker<TEvt extends BrokerEvent>() {
  const logger = createLogger(`message-broker-${brokerId++}`)
  const subscribers = new Map<string, ((opts: any) => Promise<any>)[]>()

  function dispatch<T extends TEvt['type']>(
    event: T,
    opts: Omit<ConcreteEvent<TEvt, T>, 'type'>
  ) {
    const handlers = subscribers.get(event)
    if (handlers) {
      for (const handler of handlers ?? []) {
        handler(opts).catch(ex => logger.error('Dispatching error', ex))
      }
    }
  }

  const dispatcher = {
    dispatch,
  }

  function subscribe<T extends TEvt['type']>(
    event: T,
    handle: (event: Omit<ConcreteEvent<TEvt, T>, 'type'>) => Promise<void>
  ) {
    const handlers = subscribers.get(event) ?? []

    if (handlers) {
      subscribers.set(event, [...handlers, handle])
    } else {
      subscribers.set(event, [handle])
    }
  }

  const subscriber = {
    subscribe,
  }

  return { dispatcher, subscriber }
}
