import { config } from '../../../config'
import { Request, Response, NextFunction } from 'express'

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const apiKey = req.header('x-api-key')

  if (!apiKey || apiKey !== config.apiKey) {
    return res.status(403).send()
  }
  return next()
}

export function checkAuthMiddleware(apiKey: string) {
  function checkAuthApi() {
    return (checkApiKey: string) => checkApiKey === apiKey
  }
}

// const checkAuthApiA = checkAuthApi(config.apiKey)
// const checkAuthApiB = checkAuthApi(config.apiKey2electricboogaloo)
// const check1 = checkAuthApiA('AEIfieliesnfpiaehfipaeffeoibfibeoifbheoihf')
// const check2 = checkAuthApiA('poop')
// const check3 = checkAuthApiB('liehfaefoiewghfewghfoieshfoieshfuoeshf')
// const check4 = checkAuthApiA('poop')

// console.log(check1, check2, check3, check4)
