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

router.get('/', async (req, res) => {
  const savedSettings = await repo.scannerSettings.get()
  const savedSettingsDto = toScannerSettingsDto(savedSettings)

  return res.render('scanner.pug', {
    scannerSettings: savedSettingsDto,
    originalUrl: req.originalUrl,
  })
})

router.post('/', async (req, res) => {
  const data = req.body as {
    ipAddresses: string[]
    ipNetmasks: string[]
    ipRanges: string[]
    originalUrl: string
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
    if (!range.includes("-")) {
      invalidRanges.push({
        from: range,
        to: range,
        reason: 'Range does not contain -',
      })
      continue
    }

    const [from, to] = range.split('-')

    if (!isValidIp(from)) {
      invalidRanges.push({
        from,
        to,
        reason: 'From is not a valid IP',
      })

    }

    if (!isValidIp(to)) {
      invalidRanges.push({
        from,
        to,
        reason: 'To is not a valid IP',
      })

    }

    if (!isFromLowerThanTo(from, to)) {
      invalidRanges.push({ from, to, reason: 'From is larger than to' })

    }
    if (isValidIp(to) && isValidIp(from) && isFromLowerThanTo(from, to)) {
      validRanges.push({ from, to })
    }

  }


  const validNetmasks: IPNetwork[] = []

  const invalidNetmasks: InvalidNetmask[] = []

  for (const netmask of data?.ipNetmasks ?? []) {
    const [ip, mask] = netmask.split('/')
    if (!(isValidIp(ip) && isValidCidr(mask))) {
      invalidNetmasks.push({
        ip,
        mask,
        reason: 'Either IP or CIDR is not valid',
      })
    }
    if (!isValidIp(ip)) {
      invalidNetmasks.push({
        ip,
        mask,
        reason: 'IP is not valid',
      })
    }
    if (isValidIp(ip) && isValidNetmask(mask)) {
      validNetmasks.push({ ip, mask })
    }
  }

  const settings: ScannerSettings = {
    addresses: validIps,
    networks: validNetmasks,
    ranges: validRanges,
  }

  const savedSettings = await repo.scannerSettings.update(settings)
  const savedSettingsDto = toScannerSettingsDto(savedSettings)

  if (data.originalUrl.includes('setup-wizard')) {
    return res.redirect(data.originalUrl)
  }

  if (invalidIps.length || invalidRanges.length || invalidNetmasks.length) {
    let detailList = [JSON.stringify(invalidIps)]
    detailList.push(JSON.stringify(invalidNetmasks))
    detailList.push(JSON.stringify(invalidRanges))
    return res.render('scanner.pug', {
      scannerSettings: savedSettingsDto,
      error: {
        message: 'One or more IP settings are invalid.',
        details: detailList,
      }
    })
  }
  else {
    return res.render('scanner.pug', {
      scannerSettings: savedSettingsDto,
    })
  }
  
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

function isValidCidr(cidr: number | string) {
  const casted = Number.isInteger(cidr) ? cidr : +cidr
  return casted >= 0 && casted <= 32
}

export default router
