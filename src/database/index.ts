import Database from 'simplest.db'
import { IPNetwork, IPRange } from '../types'

type IpScannerSettings = {
  addresses: string[]
  ranges: IPRange[]
  networks: IPNetwork[]
}

export function createIpScannerSettingsRepo(path?: string) {
  const db = new Database({
    path: path ?? './scanner-settings.db',
    type: 'SQLite',
    check: true,
    cacheType: 0,
  })

  const update = (settings: IpScannerSettings) =>
    db.set('0', settings) as IpScannerSettings

  const get = () => db.get('0') as IpScannerSettings

  return {
    update,
    get,
  }
}
