import { getDefaultIp } from '../adb/utils'
import { createLogger } from '../shared/logger'
import axios from 'axios'
import { config } from '../config'

const CYCLE_TIMEOUT_MSEC = 300 * 1000
const logger = createLogger('dns-beacon-service')
let shouldRun = false

const api = axios.create({
  url: '',
  baseURL: config.dnsBeaconUrl,
  headers: { 'Content-Type': 'application/json' },
})

export function createDnsBeaconService() {
  function start() {
    if (shouldRun) {
      return
    }
    shouldRun = true
    startCycle().catch(ex => logger.error(ex))
    logger.info('DNS Beacon Service has started')
  }

  function stop() {
    if (!shouldRun) {
      return
    }
    shouldRun = false
    logger.info('DNS Beacon Service has stopped')
  }

  async function startCycle() {
    logger.trace('Started DNS Beacon cycle')
    if (shouldRun) {
      try {
        const ip = getDefaultIp()
        if (!ip) {
          throw new Error('Failed to detect default IP address')
        }
        const resp = await api.post('', {
          ip,
          installId: config.installId,
        })

        if (resp.status !== 201) {
          throw new Error(
            `API has returned error ${resp.status} ${resp.statusText}`
          )
        }
        logger.trace('Beaconed successfully')
      } catch (ex: any) {
        logger.error('Failed execute cycle', ex.message)
      } finally {
        if (shouldRun) {
          logger.trace('Scheduled next cycle')
          setTimeout(async () => await startCycle(), CYCLE_TIMEOUT_MSEC)
        }
      }
    }
  }
  return { start, stop }
}
