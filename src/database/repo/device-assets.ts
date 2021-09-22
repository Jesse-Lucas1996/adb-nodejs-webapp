import NeDB from 'nedb-promises'

export type DeviceAsset = {
  serial: string
  name: string
}

type StoredAssets = {
  version: string
  assets: DeviceAsset[]
}

export function createDeviceAssetsRepo(path?: string) {
  const datastore = NeDB.create(path ?? './assets.db')
  datastore.ensureIndex({ fieldName: 'version', unique: true })
  const version = 'current'

  const update = async (assets: DeviceAsset[]): Promise<DeviceAsset[]> => {
    const stored = await datastore.update<StoredAssets>(
      {
        version,
      },
      {
        version,
        assets: assets ?? [],
      },
      {
        upsert: true,
        returnUpdatedDocs: true,
      }
    )
    return stored.assets
  }

  const get = async (): Promise<DeviceAsset[]> => {
    const document = await datastore.findOne<StoredAssets>({
      version,
    })
    return document?.assets ?? []
  }

  return {
    update,
    get,
  }
}
