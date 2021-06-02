import { createDeviceAssetsRepo } from './device-assets'
import { createIpScannerCandidatesRepo } from './ip-scanner-candidates'
import { createIpScannerSettingsRepo } from './ip-scanner-settings'
import { createLogsRepo } from './logs'
import { createUserCredentialsRepo } from './user-credentials'

export const repo = {
  userDb: createUserCredentialsRepo(),
  logs: createLogsRepo(),
  ipScannerSettings: createIpScannerSettingsRepo(),
  ipScannerCandidates: createIpScannerCandidatesRepo(),
  deviceAssets: createDeviceAssetsRepo(),
}
