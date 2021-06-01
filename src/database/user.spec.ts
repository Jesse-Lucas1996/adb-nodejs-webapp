import { createUserCredentialsRepo } from './index'
import { expect } from 'chai'
import * as fs from 'fs'
import path from 'path'

describe('User credentials repo', () => {
  const repo = createUserCredentialsRepo(
    path.join(__dirname, 'user-credentials-test.db')
  )

  const defaultPassword = 'PixelSamsungNetflixACoolBossAHunkOfAMan'

  it('Ensures that default admin/password is created if database is empty', () => {
    const actual = repo.validateCredentials('admin', defaultPassword)
    console.log(defaultPassword)
    expect(actual.isValid).to.be.equal(true)
  })

  it('Ensures that invalid username cannot be validated with default database', () => {
    const actual = repo.validateCredentials('admina', defaultPassword)
    expect(actual.isValid).to.be.equal(false)
  })

  it('Ensures that invalid password cannot be validated with default database', () => {
    const actual = repo.validateCredentials('admin', `${defaultPassword}0`)
    expect(actual.isValid).to.be.equal(false)
  })

  it('Ensures password can be updated', () => {
    const newPassword = 'rollthedice'
    repo.updateCredentials(newPassword)

    const actual = repo.validateCredentials('admin', newPassword)
    expect(actual.isValid).to.be.equal(true)
  })
  after(async () => {
    console.log('unlinking')
    fs.unlinkSync(path.join(__dirname, 'user-credentials-test.db'))
  })
})
