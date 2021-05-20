import { repo } from './index'
import { expect } from 'chai'
import crypto from 'crypto'

describe('User testing', () => {
  const password = repo.defaultHashedPassword
  const defaultHashedPassword = crypto
    .createHash('sha256')
    .update('PixelSamsungNetflixACoolBossAHunkOfAMan')
    .digest('hex')
  it('default password matches default', () => {
    console.log('initalized password ', password)
    expect(password === defaultHashedPassword)
  })

  it('does password update? ', () => {
    const updatePasswordRepo = repo.updateCredentials('rollthedice')
    const passwordUpdated = crypto
      .createHash('sha256')
      .update(updatePasswordRepo)
      .digest('hex')
    expect(password != passwordUpdated)
  })

  it('validated credentials ', () => {
    expect(
      console.log(repo.validateCredentials('admin', 'rollthedice').isValid)
    )
  })
})
