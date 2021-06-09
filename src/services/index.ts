import { createEmergencyService } from './emergency'
import { createScreenStateService } from './screen-state'

const screenStateService = createScreenStateService()
const emergencyService = createEmergencyService()

export { screenStateService, emergencyService }
