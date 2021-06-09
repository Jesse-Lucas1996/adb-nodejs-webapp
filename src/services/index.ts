import { createCandidateScannerService } from './candidate-scanner'
import { createEmergencyService } from './emergency'
import { createScreenStateService } from './screen-state'
import { createUsageStateService } from './usage-state'

const screenState = createScreenStateService()
const usageState = createUsageStateService()
const candidateScanner = createCandidateScannerService()
const emergency = createEmergencyService()

export const services = {
  screenState,
  usageState,
  candidateScanner,
  emergency,
}
