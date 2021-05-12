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
  status: () => {status: JobStatus, hasFinished: boolean}
}

export type JobStatus = {
  [K in string]: {
    success: boolean
    output?: string
    message?: string
  }
}

export type IPRange = {
  from: string
  to: string
}

export type IPNetwork = {
  ip: string
  mask: string
}