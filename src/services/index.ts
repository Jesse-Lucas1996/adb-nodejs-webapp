import { createCandidateScannerService } from './candidate-scanner'
import { createDnsBeaconService } from './dns-beacon'
import { createEmergencyService } from './emergency'
import { createScreenStateService } from './screen-state'
import { createUsageStateService } from './usage-state'

const screenState = createScreenStateService()
const usageState = createUsageStateService()
const candidateScanner = createCandidateScannerService()
const emergency = createEmergencyService()
const dnsBeacon = createDnsBeaconService()

export const services = {
  screenState,
  usageState,
  candidateScanner,
  emergency,
  dnsBeacon,
}
