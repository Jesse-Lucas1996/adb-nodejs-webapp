import { expect } from 'chai'
import * as fs from 'fs'
import * as path from 'path'
import { createScannerSettingsRepo } from './scanner-settings'

describe('IP Scanner Settings repo testing', () => {
  // Testing valid ip

  const settings = {
    addresses: ['1.1.1.1', '2.2.2.2'],
    ranges: [
      { from: '10.0.0.1', to: '10.0.0.23' },
      { from: '10.0.1.50', to: '10.0.1.55' },
    ],
    networks: [
      { ip: '11.1.0.0', mask: '30' },
      { ip: '12.1.0.0', mask: '30' },
    ],
  }

  const db = createScannerSettingsRepo(path.join(__dirname, 'TEST.db'))

  it('Attempt to make empty db and write to', async () => {
    const actual = await db.update(settings)
    expect(actual).to.be.deep.equal(settings)
  })
  it('Atttempt to get from current database', async () => {
    const actual = await db.get()
    expect(actual.addresses).deep.equal(settings.addresses)
  })
  after(async () => {
    fs.unlinkSync(path.join(__dirname, 'TEST.db'))
  })
})
