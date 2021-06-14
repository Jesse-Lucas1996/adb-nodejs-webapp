import { createDeviceAssetsRepo } from './repo/device-assets'
import { createConnectionCandidatesRepo } from './repo/connection-candidates'
import { createScannerSettingsRepo as createScannerSettingsRepo } from './repo/scanner-settings'
import { createLogsRepo } from './repo/logs'
import { createUserCredentialsRepo } from './repo/user-credentials'
import { createScreenStateStore } from './store/screen-state'
import { createUsageStateStore } from './store/usage-state'
import { createTasksRepo } from './repo/tasks'

export const repo = {
  credentials: createUserCredentialsRepo(),
  assets: createDeviceAssetsRepo(),
  connectionCandidates: createConnectionCandidatesRepo(),
  scannerSettings: createScannerSettingsRepo(),
  logs: createLogsRepo(),
  tasks: createTasksRepo(),
}

export const store = {
  screenState: createScreenStateStore(),
  usageState: createUsageStateStore(),
}
