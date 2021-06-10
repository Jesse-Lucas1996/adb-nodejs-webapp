import { Request, Response, NextFunction, RequestHandler } from 'express'

export function createCookieAuthMiddleware(username: string): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.signedCookies.user === username) {
      return next()
    } else {
      return res.redirect('/auth')
    }
  }
}
