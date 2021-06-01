import Database from 'simplest.db'
import { IPRange, IPNetwork } from '../types'

export type IpScannerSettings = {
  addresses: string[]
  ranges: IPRange[]
  networks: IPNetwork[]
}

export function createIpScannerSettingsRepo(path?: string) {
  const db = new Database({
    path: path ?? './ip-scanner-settings.db',
    type: 'SQLite',
    check: true,
    cacheType: 0,
  })

  const update = (settings: IpScannerSettings) =>
    db.set('0', settings) as IpScannerSettings

  const get = (): IpScannerSettings =>
    db.get('0') ?? {
      addresses: [],
      ranges: [],
      networks: [],
    }

  return {
    update,
    get,
  }
}
