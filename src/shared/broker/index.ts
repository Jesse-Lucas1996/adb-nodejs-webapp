import { createLogger } from '../logger'

type BrokerEvent = {
  type: string
}

type Dispatcher<TEvt extends BrokerEvent> = {
  dispatch: (event: TEvt['type'], args: any) => Promise<any>
}

type Subscriber<TEvt extends BrokerEvent> = {
  subscribe: (
    event: TEvt['type'],
    handle: (event: TEvt) => Promise<void>
  ) => void
}

let lastInstanceId = 0

function createMessageBroker<TEvt extends BrokerEvent>() {
  const logger = createLogger(`message-broker-${lastInstanceId++}`)
  const subscribers = new Map<string, any[]>()

  async function dispatch(event: TEvt['type'], args: any) {
    const handlers = subscribers.get(event)
    if (handlers) {
      for (const handler of handlers ?? []) {
        try {
          await handler(args)
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
    handle: (event: TEvt) => Promise<void>
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

const { dispatcher, subscriber } = createMessageBroker<Event>()

export { dispatcher, subscriber }
