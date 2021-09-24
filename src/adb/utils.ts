import { IPRange, IPNetwork } from '../types'
import os from 'os'
import { execSync } from 'child_process'

export function fromRange({ from, to }: IPRange): string[] {
  if (!(isValidIp(from) && isValidIp(to))) {
    throw new Error(`From ${from} or to ${to} is not a valid IP address`)
  }
  const fromOctets = from.split('.').map(f => tryParseInt(f))
  const toOctets = to.split('.').map(f => tryParseInt(f))

  if (!(fromOctets.length == 4 && toOctets.length == 4)) {
    throw new Error('Failed to parse from to to input')
  }

  const [fa, fb, fc, fd] = fromOctets
  const [ta, tb, tc, td] = toOctets

  const result: string[] = []

  // Octet A
  for (let va = fa; va <= ta; va++) {
    // Octet B
    const fromB = va === fa ? fb : 0
    const toB = va === ta ? tb : 255
    for (let vb = fromB; vb <= toB; vb++) {
      // Octet C
      const fromC = va === fa && vb === fb ? fc : 0
      const toC = va === ta && vb === tb ? tc : 255
      for (let vc = fromC; vc <= toC; vc++) {
        // Octet D
        const fromD = va === fa && vb === fb && vc === fc ? fd : 0
        const toD = va === ta && vb === tb && vc === tc ? td : 255
        for (let vd = fromD; vd <= toD; vd++) {
          result.push(`${va}.${vb}.${vc}.${vd}`)
        }
      }
    }
  }

  if (!result.length) {
    throw new Error('Incorrect range')
  }

  return result
}

export function fromNetmask({ ip, mask }: IPNetwork): string[] {
  if (!(isValidIp(ip) && isValidNetmask(mask))) {
    throw new Error(`${ip} is not a valid IP or ${mask} is not a valid netmask`)
  }

  const ipOctets = ip.split('.').map(f => tryParseInt(f))
  const maskOctets = mask.split('.').map(f => tryParseInt(f))

  if (!(ipOctets.length == 4 && maskOctets.length == 4)) {
    throw new Error('Failed to parse IP or netmask')
  }

  const lowestIp = ipOctets
    .map((v, i) => v & maskOctets[i])
    .reduce((acc, v, i) => (i === 0 ? acc + v : acc + '.' + v), '')

  const highestIp = maskOctets
    .map(v => Math.pow(2, 8) + ~v)
    .map((v, i) => v | ipOctets[i])
    .reduce((acc, v, i) => (i === 0 ? acc + v : acc + '.' + v), '')

  const range = fromRange({
    from: lowestIp,
    to: highestIp,
  })

  if (range.length > 2) {
    return range.slice(1, range.length - 1)
  }

  return range
}

function tryParseInt(input: string) {
  const res = parseInt(input)
  if (typeof res !== 'number') {
    throw new Error(`${input} is not a number`)
  }
  return res
}

export function isValidIp(ip: string) {
  const regex =
    /^(([01]?\d\d?|2[0-4]\d|25[0-5]).){3}([01]?\d\d?|2[0-4]\d|25[0-5])$/

  return regex.test(ip)
}

export function isValidNetmask(mask: string) {
  const regex =
    /^((128|192|224|240|248|252|254)\.0\.0\.0)|(255\.(((0|128|192|224|240|248|252|254)\.0\.0)|(255\.(((0|128|192|224|240|248|252|254)\.0)|255\.(0|128|192|224|240|248|252|254)))))$/

  return regex.test(mask)
}

export function getIPv4Interfaces() {
  const interfaces = os.networkInterfaces(),
    values = Object.values(interfaces),
    res = values.reduce((acc, curr) => {
      if (curr) {
        for (const e of curr) {
          if (e.family === 'IPv4' && !e.internal) {
            acc.push(e)
          }
        }
      }
      return acc
    }, new Array())

  return res as os.NetworkInterfaceInfoIPv4[]
}

export function getDefaultGateway() {
  const routingTable = execSync('ip route').toString().trim()
  const regex =
    /^default\svia\s(([01]?\d\d?|2[0-4]\d|25[0-5]).){3}([01]?\d\d?|2[0-4]\d|25[0-5])/
  const parsed = routingTable.match(regex)
  if (!(parsed && parsed.length)) {
    throw new Error('No default gateway found')
  }
  const dgw = parsed[0].replace('default via ', '')

  return dgw
}

export function floorIpAddress(ip: number[], netmask: number[]) {
  const numberOfOctets = 4
  if (!(ip.length === numberOfOctets && netmask.length === numberOfOctets)) {
    throw new Error('Either IP or netmask is invalid')
  }

  const result: number[] = []
  for (let i = 0; i < numberOfOctets; i++) {
    result.push(ip[i] & netmask[i])
  }

  return result.join('.')
}

export function getDefaultIp() {
  const dgw = getDefaultGateway()
    .split('.')
    .map(o => +o)

  const interfaces = getIPv4Interfaces()
  for (const iface of interfaces) {
    const ip = iface.address.split('.').map(o => +o),
      netmask = iface.netmask.split('.').map(o => +o),
      flooredIp = floorIpAddress(ip, netmask),
      flooredDgw = floorIpAddress(dgw, netmask)

    if (flooredIp === flooredDgw) {
      return iface.address
    }
  }

  return undefined
}
