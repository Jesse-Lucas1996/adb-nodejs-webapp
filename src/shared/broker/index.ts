import { repo } from '../../database'
import { ApplicationError } from '../../types'
import { createMessageBroker } from './message-broker'
import { v4 as uuid } from 'uuid'
import { pool } from '../../adb'
import { createJob } from '../job'

type CandidateDiscovered = {
  type: 'CandidateDiscovered'
  ip: string
}

type ProvisionRequested = {
  type: 'ProvisionRequested'
  serial: string
}

type BrokerEvents = CandidateDiscovered | ProvisionRequested

const { dispatcher, subscriber } = createMessageBroker<BrokerEvents>()

const inflights = new Set<string>()

subscriber.subscribe('ProvisionRequested', async ({ serial }) => {
  if (inflights.has(serial)) {
    return
  }

  inflights.add(serial)
  const taskId = 'provisionDevice'
  const task = await repo.tasks.get(taskId)

  if (!task) {
    throw new ApplicationError(
      `Task ${taskId} does not exist, cannot fulfill provision request for ${serial}`
    )
  }

  const jobId = uuid()
  const job = createJob(
    jobId,
    task.unitsOfWork,
    [serial],
    `Auto generated provisioning job for ${serial}`
  )
  job.start(pool, () => inflights.delete(serial))
})

export { dispatcher, subscriber }
