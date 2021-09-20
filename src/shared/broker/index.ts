import { createMessageBroker } from './message-broker'

type CandidateDiscovered = {
  type: 'CandidateDiscovered'
  ip: string
}

type BrokerEvents = CandidateDiscovered

const { dispatcher, subscriber } = createMessageBroker<BrokerEvents>()

export { dispatcher, subscriber }
