import * as express from 'express'

export async function errorMiddleware(
  ex: any,
  _req: express.Request,
  res: express.Response,
  _next: express.NextFunction
) {
  const status = ex.statusCode || ex.status
  if (isClientError(status)) {
    console.error('Client error', { error: ex })
    return res.status(status).send({ message: ex.message })
  }
  console.error('Unhandled error', { error: ex })
  return res.status(status || 500).send({ message: 'Internal server error' })
}

function isClientError(httpStatusCode: number): boolean {
  return httpStatusCode >= 400 && httpStatusCode < 500
}
