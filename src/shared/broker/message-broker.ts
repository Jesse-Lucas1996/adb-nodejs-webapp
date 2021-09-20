import { createLogger } from '../logger'

type BrokerEvent = {
  type: string
}

type Dispatcher<TEvt extends BrokerEvent> = {
  dispatch: (
    event: TEvt['type'],
    opts: Omit<ConcreteEvent<TEvt, TEvt['type']>, 'type'>
  ) => Promise<any>
}

type Subscriber<TEvt extends BrokerEvent> = {
  subscribe: (
    event: TEvt['type'],
    handle: (
      event: Omit<ConcreteEvent<TEvt, TEvt['type']>, 'type'>
    ) => Promise<void>
  ) => void
}

type ConcreteEvent<TEvt extends BrokerEvent, T extends string> = Extract<
  TEvt,
  { type: T }
>

let lastInstanceId = 0

export function createMessageBroker<TEvt extends BrokerEvent>() {
  const logger = createLogger(`message-broker-${lastInstanceId++}`)
  const subscribers = new Map<string, any[]>()

  async function dispatch(
    event: TEvt['type'],
    opts: Omit<ConcreteEvent<TEvt, TEvt['type']>, 'type'>
  ) {
    const handlers = subscribers.get(event)
    if (handlers) {
      for (const handler of handlers ?? []) {
        try {
          await handler(opts)
        } catch (ex) {
          logger.error('Dispatching error', ex)
        }
      }
    }
  }

  const dispatcher: Dispatcher<TEvt> = {
    dispatch,
  }

  function subscribe(
    event: TEvt['type'],
    handle: (
      event: Omit<ConcreteEvent<TEvt, TEvt['type']>, 'type'>
    ) => Promise<void>
  ) {
    const handlers = subscribers.get(event) ?? []

    if (handlers) {
      subscribers.set(event, [...handlers, handle])
    } else {
      subscribers.set(event, [handle])
    }
  }

  const subscriber: Subscriber<TEvt> = {
    subscribe,
  }

  return { dispatcher, subscriber }
}
