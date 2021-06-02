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

  const index = '0'

  if (!db.get(index)) {
    db.set(index, {
      addresses: [],
      ranges: [],
      networks: [],
    })
  }

  const update = (settings: IpScannerSettings): IpScannerSettings =>
    db.set(index, settings)

  const get = (): IpScannerSettings => db.get(index)

  return {
    update,
    get,
  }
}
