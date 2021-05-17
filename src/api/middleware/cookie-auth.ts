import { Request, Response, NextFunction, RequestHandler } from 'express'

export function createCookieAuth(username: string): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.signedCookies.user === username) {
      return next()
    } else {
      return res.status(403).send()
    }
  }
}
