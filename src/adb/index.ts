import { createAdbConnector } from './connector'
import { config } from '../../config'

const adbConnector = createAdbConnector(config.ips)

export { adbConnector }
