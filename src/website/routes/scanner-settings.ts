import Router from 'express-promise-router'
import { isValidIp, isValidNetmask } from '../../adb/utils'
import { repo } from '../../database'
import { ScannerSettings } from '../../database/repo/scanner-settings'
import { IPNetwork, IPRange } from '../../types'

const router = Router()

type InvalidIP = {
  ip: string
  reason: string
}

type InvalidIPRange = IPRange & {
  reason: string
}

type InvalidNetmask = IPNetwork & {
  reason: string
}

router.get('/', getScannerSettings)

router.post('/', async (req, res) => {
  const data = req.body as {
    ipAddresses: string[]
    ipNetmasks: string[]
    ipRanges: string[]
  }

  const validIps = []
  const invalidIps: InvalidIP[] = []

  for (const ip of data?.ipAddresses ?? []) {
    const isValid = isValidIp(ip)
    if (isValid) {
      validIps.push(ip)
    } else {
      invalidIps.push({ ip, reason: 'IP is not valid' })
    }
  }

  const validRanges: IPRange[] = []
  const invalidRanges: InvalidIPRange[] = []

  for (const range of data?.ipRanges ?? []) {
    const [from, to] = range.split('-')

    if (!(isValidIp(from) && isValidIp(to))) {
      invalidRanges.push({
        from,
        to,
        reason: 'Either from or to is not a valid IP',
      })
      continue
    }

    if (!isFromLowerThanTo(from, to)) {
      invalidRanges.push({ from, to, reason: 'From is larger than to' })
      continue
    }

    validRanges.push({ from, to })
  }

  const validNetmasks: IPNetwork[] = []
  const invalidNetmasks: InvalidNetmask[] = []

  for (const netmask of data?.ipNetmasks ?? []) {
    const [ip, mask] = netmask.split('/')

    if (!(isValidIp(ip) && isValidNetmask(mask))) {
      invalidNetmasks.push({
        ip,
        mask,
        reason: 'Either IP or Netmask is not valid',
      })
      continue
    }

    validNetmasks.push({ ip, mask })
  }

  const settings: ScannerSettings = {
    addresses: validIps,
    networks: validNetmasks,
    ranges: validRanges,
  }

  const savedSettings = await repo.scannerSettings.update(settings)
  const savedSettingsDto = toScannerSettingsDto(savedSettings)

  return res.render('scanner.pug', {
    scannerSettings: savedSettingsDto,
    invalidData: {
      invalidNetmasks: invalidNetmasks.map(
        n => `${n.ip}/${n.mask}: ${n.reason}`
      ),
      invalidRanges: invalidRanges.map(n => `${n.from}/${n.to}: ${n.reason}`),
      invalidIps: invalidIps.map(n => `${n.ip}: ${n.reason}`),
    },
  })
})

export function toScannerSettingsDto(settings: ScannerSettings) {
  return {
    addresses: settings.addresses,
    networks: settings.networks.map(n => `${n.ip}/${n.mask}`),
    ranges: settings.ranges.map(r => `${r.from}-${r.to}`),
  }
}

function isFromLowerThanTo(from: string, to: string) {
  const fromArr = from.split('.')
  const toArr = to.split('.')

  for (let i = 0; i < 4; i++) {
    if (fromArr[i] > toArr[i]) {
      return false
    }
  }
  return true
}

export async function getScannerSettings(
  _req: express.Request,
  res: express.Response
) {
  const savedSettings = await repo.scannerSettings.get()
  const savedSettingsDto = toScannerSettingsDto(savedSettings)

  res.render('scanner.pug', {
    scannerSettings: savedSettingsDto,
  })
}

export default router
