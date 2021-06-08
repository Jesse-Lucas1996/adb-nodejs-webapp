import { createDeviceAssetsRepo } from './device-assets'
import { createConnectionCandidatesRepo } from './connection-candidates'
import { createScannerSettingsRepo as createScannerSettingsRepo } from './scanner-settings'
import { createLogsRepo } from './logs'
import { createUserCredentialsRepo } from './user-credentials'

export const repo = {
  credentials: createUserCredentialsRepo(),
  assets: createDeviceAssetsRepo(),
  connectionCandidates: createConnectionCandidatesRepo(),
  scannerSettings: createScannerSettingsRepo(),
  logs: createLogsRepo(),
}
