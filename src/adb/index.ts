import { createConnectionPool } from './connection-pool'
import { createCandidateScanner } from './candidate-scanner'

const candidateScanner = createCandidateScanner()
const pool = createConnectionPool()

export { pool, candidateScanner }
