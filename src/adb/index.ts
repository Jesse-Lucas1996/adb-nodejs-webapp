import { createConnectionPool } from './connector'
import { config } from '../../config'
import { createCandidateScanner } from './candidate-scanner'

const candidateScanner = createCandidateScanner()
const pool = createConnectionPool(config.ips)

export { pool, candidateScanner }
