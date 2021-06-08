import NeDB from 'nedb-promises'
import { IPRange, IPNetwork } from '../types'

export type ScannerSettings = {
  addresses: string[]
  ranges: IPRange[]
  networks: IPNetwork[]
}

type StoredScannerSettings = {
  version: string
} & ScannerSettings

export function createScannerSettingsRepo(path?: string) {
  const datastore = NeDB.create(path ?? './scanner-settings.db')
  const version = 'current'

  const update = async (
    settings: ScannerSettings
  ): Promise<ScannerSettings> => {
    const stored = await datastore.update<StoredScannerSettings>(
      {
        version,
      },
      {
        version,
        addresses: settings.addresses ?? [],
        ranges: settings.ranges ?? [],
        networks: settings.networks ?? [],
      },
      {
        upsert: true,
        returnUpdatedDocs: true,
      }
    )
    const { addresses, ranges, networks } = stored
    return {
      addresses,
      ranges,
      networks,
    }
  }

  const get = async (): Promise<ScannerSettings> => {
    const document = await datastore.findOne<StoredScannerSettings>({
      version,
    })
    return {
      addresses: document?.addresses ?? [],
      ranges: document?.ranges ?? [],
      networks: document?.networks ?? [],
    }
  }

  return {
    update,
    get,
  }
}
