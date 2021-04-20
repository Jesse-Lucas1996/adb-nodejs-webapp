import { createConnectionPool } from './connector'
import { config } from '../../config'

const pool = createConnectionPool(config.ips)

export { pool }
