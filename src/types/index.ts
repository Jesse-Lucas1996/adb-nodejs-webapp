import { ConnectionPool } from '../adb/connection-pool'

export type TaskType = 'sendEmergency' | 'stopEmergency' | 'reset' | 'uptime'

export type CommandValidator = (cmdOutput: string) => {
  error: boolean
  message?: string
}

export type UnitOfWork = {
  cmd: string
  validate?: CommandValidator
}

export type Task = UnitOfWork[]

export type JobConnectionPool = Omit<ConnectionPool, 'start' | 'stop'>

export type Job = {
  id: string
  start: (pool: JobConnectionPool) => void
  status: () => { status: JobStatus; hasFinished: boolean }
}

export type Jobs = {
  [K in string]?: { status: JobStatus; hasFinished: boolean }
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

export class DeserializationError extends Error {}
