import Database from 'simplest.db'

export type DeviceAsset = {
  serial: string
  name: string
}

export function createDeviceAssetsRepo(path?: string) {
  const db = new Database({
    path: path ?? './assets.db',
    type: 'SQLite',
    check: true,
    cacheType: 0,
  })

  const index = '0'

  if (!db.get(index)) {
    db.set(index, [])
  }

  const update = (assets: DeviceAsset[]): DeviceAsset[] => db.set(index, assets)

  const get = (): DeviceAsset[] => db.get(index)

  return {
    update,
    get,
  }
}
