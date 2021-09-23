import * as bunyan from 'bunyan'
import Pretty from 'bunyan-prettystream'
import { Config, config } from '../../config'
import { repo } from '../../database'
import { LogEntry, LogLevel } from './types'

const DRAIN_TIMEOUT = 10 * 1000
const entries = new Array<LogEntry>()

const drain = () => {
  const spliced = entries.splice(0, entries.length)
  repo.logs
    .append(spliced)
    .then()
    .catch(ex => console.error('Write log error', ex))

  setTimeout(() => {
    drain()
  }, DRAIN_TIMEOUT)
}
drain()

function getStdStream(config: Config) {
  if (config.appEnv === 'dev' || config.appEnv === 'test') {
    const stdOut = new Pretty()
    stdOut.pipe(process.stdout)
    return stdOut
  }
  return process.stdout
}

function getLevel(config: Config): bunyan.LogLevel {
  if (config.appEnv === 'dev' || config.appEnv === 'test') {
    return 'trace'
  }
  return 'info'
}

type WriteStreamOpts = {
  name: string
  hostname: string
  pid: number
  level: number
  msg: string
  time: Date
  v: number
}

// Naive implementation or WritableStream. It may need extended implementation in future like end() etc.
const dbStream = {
  write: (log: WriteStreamOpts) => {
    const entry = streamLogToLogEntry(log)
    entries.push(entry)
  },
} as any

function streamLogToLogEntry(log: WriteStreamOpts): LogEntry {
  const logLevelLookup: { [K in number]: LogLevel } = {
    60: 'fatal',
    50: 'error',
    40: 'warn',
    30: 'info',
    20: 'debug',
    10: 'trace',
  }

  return {
    name: log.name,
    level: logLevelLookup[log.level],
    message: log.msg,
    timestamp: log.time.toISOString(),
  }
}

const logger = bunyan.createLogger({
  name: 'android-tv',
  serializers: {
    err: bunyan.stdSerializers.err,
  },
  stream: getStdStream(config),
  level: getLevel(config),
})

logger.addStream({
  type: 'raw',
  stream: dbStream,
  level: getLevel(config),
})

export function createLogger(name: string) {
  const log = logger.child({})
  log.fields.name = name

  return log
}
