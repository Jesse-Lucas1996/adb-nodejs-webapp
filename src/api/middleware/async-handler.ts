import { RequestHandler } from 'express'

export const asyncHandler = (func: RequestHandler): RequestHandler => (
  req,
  res,
  next
): Promise<void> => Promise.resolve(func(req, res, next)).catch(next)
