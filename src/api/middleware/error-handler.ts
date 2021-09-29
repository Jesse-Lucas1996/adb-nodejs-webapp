import { Request, Response, NextFunction } from 'express'
import { createLogger } from '../../shared/logger'
import { ApplicationError } from '../../types'

const logger = createLogger('Express Error Handler')

export async function errorHandler(
  ex: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const status = ex.statusCode || ex.status
  if (isClientError(status)) {
    logger.error('Client error', { error: ex })
    return res
      .status(status)
      .send({ message: 'Client error', details: ex.message })
  }

  if (ex instanceof ApplicationError) {
    logger.error('Application error', { error: ex })
    return res
      .status(400)
      .send({ message: 'Application error', details: ex.message })
  }

  logger.error('Internal server error', { error: ex })
  return res
    .status(status || 500)
    .send({ message: 'Internal server error', details: ex.message })
}

function isClientError(httpStatusCode: number): boolean {
  return httpStatusCode >= 400 && httpStatusCode < 500
}
