import { Client } from '@devicefarmer/adbkit'

export type TaskType = 'sendEmergency' | 'reset' | 'uptime'

export type CommandValidator = (
  cmdOutput: string
) => { error: boolean; message?: string }

export type UnitOfWork = {
  cmd: string
  validate?: CommandValidator
}

export type Task = UnitOfWork[]

export type Job = {
  id: string
  start: (client: Client) => void
  status: () => JobStatus
}

export type JobStatus = {
  [K in string]: {
    success: boolean
    output?: string
    message?: string
  }
}
