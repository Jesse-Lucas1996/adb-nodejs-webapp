import { expect } from 'chai'
import * as fs from 'fs'
import path from 'path'
import { createUserCredentialsRepo } from './user-credentials'

describe('User credentials repo', () => {
  const repo = createUserCredentialsRepo(
    path.join(__dirname, 'user-credentials-test.db')
  )

  const defaultPassword = 'CloudTV1'

  it('Ensures that default admin/password is created if database is empty', async () => {
    const actual = await repo.validate('admin', defaultPassword)
    expect(actual.isValid).to.be.equal(true)
  })

  it('Ensures that invalid username cannot be validated with default database', async () => {
    const actual = await repo.validate('admina', defaultPassword)
    expect(actual.isValid).to.be.equal(false)
  })

  it('Ensures that invalid password cannot be validated with default database', async () => {
    const actual = await repo.validate('admin', `${defaultPassword}0`)
    expect(actual.isValid).to.be.equal(false)
  })

  it('Ensures password can be updated', async () => {
    const newPassword = 'rollthedice'
    await repo.update(newPassword)

    const actual = await repo.validate('admin', newPassword)
    expect(actual.isValid).to.be.equal(true)
  })
  after(async () => {
    fs.unlinkSync(path.join(__dirname, 'user-credentials-test.db'))
  })
})
