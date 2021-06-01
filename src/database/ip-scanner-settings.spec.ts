import { expect } from 'chai'
import * as fs from 'fs'
import * as path from 'path'
import { createIpScannerSettingsRepo } from './ip-scanner-settings'

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

  const db = createIpScannerSettingsRepo(path.join(__dirname, 'TEST.db'))

  it('Attempt to make empty db and write to', () => {
    const actual = db.update(settings)
    console.log(actual)
    expect(actual).to.be.equal(settings)
  })
  it('Atttempt to get from current database', () => {
    const actual = db.get()
    expect(actual.addresses).deep.equal(settings.addresses)
  })
  after(async () => {
    console.log('unlinking')
    fs.unlinkSync(path.join(__dirname, 'TEST.db'))
  })
})
