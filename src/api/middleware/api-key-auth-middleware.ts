import { Request, Response, NextFunction, RequestHandler } from 'express'

export function createApiKeyAuthMiddleware(apiKey: string): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const reqApiKey = req.header('x-api-key')

    if (!reqApiKey || reqApiKey !== apiKey) {
      return res.status(403).send()
    }
    return next()
  }
}
