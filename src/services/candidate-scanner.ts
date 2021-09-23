import { createLogger } from '../shared/logger'
import { fromNetmask, fromRange } from '../adb/utils'
import { createConnection } from 'net'
import { repo } from '../database'
import { dispatcher } from '../shared/broker'

const CYCLE_TIMEOUT_MSEC = 60 * 1000
const TCP_PROBE_TIMEOUT_MSEC = 1 * 1000
const PORT = 5555

const logger = createLogger('candidate-scanner')

export function createCandidateScannerService() {
  let isRunning = false
  let shouldRun = false

  function start() {
    shouldRun = true
    startOnce()
    logger.info('Scanner has started')
  }

  function startOnce() {
    startCycle().catch(ex => logger.error(ex))
  }

  async function startCycle() {
    if (isRunning) {
      return logger.warn('An active cycle is still running. Ignoring.')
    }
    isRunning = true

    const ipCandidates = new Set<string>()
    const ipSettings = await repo.scannerSettings.get()

    const ips = ipSettings.addresses
    const ipsFromRanges = ipSettings.ranges.reduce((acc, curr) => {
      try {
        acc = [...acc, ...fromRange(curr)]
      } catch (ex) {
        logger.error('Failed to convert range', curr, 'Details', ex)
      } finally {
        return acc
      }
    }, new Array<string>())
    const ipsFromNetmasks = ipSettings.networks.reduce((acc, curr) => {
      try {
        acc = [...acc, ...fromNetmask(curr)]
      } catch (ex) {
        logger.error('Failed to convert netmask', curr, 'Details', ex)
      } finally {
        return acc
      }
    }, new Array<string>())

    const uniqueIps = [
      ...new Set<string>([...ips, ...ipsFromRanges, ...ipsFromNetmasks]),
    ]

    for (let i = 0; i < uniqueIps.length; i++) {
      const ip = uniqueIps[i]

      // Explicitly added IPs to be always added to candidate list regardless
      if (ips.includes(ip)) {
        ipCandidates.add(ip)
      }

      try {
        const success = await probeTcp(ip, PORT)
        if (success) {
          await dispatcher.dispatch('CandidateDiscovered', { ip })
          ipCandidates.add(ip)
        }
      } catch (ex) {
        logger.trace(`Could not connect to ${ip}`)
      } finally {
        await repo.connectionCandidates.update([...ipCandidates])
      }
    }

    isRunning = false

    if (shouldRun) {
      setTimeout(() => {
        startOnce()
      }, CYCLE_TIMEOUT_MSEC)
    }
  }

  function stop() {
    shouldRun = false
    logger.info('Scanner has stopped')
  }

  return { start, stop }
}

async function probeTcp(host: string, port: number) {
  return new Promise<boolean>((resolve, reject) => {
    const client = createConnection({
      host,
      port,
      timeout: TCP_PROBE_TIMEOUT_MSEC,
    })
    client.on('connect', (err: any) => {
      client.end()
      client.destroy()
      if (err) {
        reject(err)
      }
      resolve(true)
    })
    client.on('timeout', (err: any) => {
      client.destroy()
      reject(err)
    })
    client.on('error', (err: any) => {
      client.destroy()
      reject(err)
    })
  })
}
