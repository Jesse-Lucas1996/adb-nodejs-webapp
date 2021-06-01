import { expect } from 'chai'
import * as fs from 'fs'
import * as path from 'path'
import { createLogsRepo, LogEntry } from './index'

describe('logsSettings test', () => {
  const entry: LogEntry = {
    name: 'adb',
    level: 'error',
    timestamp: '31/05/2021, 9:35:25 am',
    message: '"Hello"',
  }

  const db = createLogsRepo(path.join(__dirname, 'logsTest.db'))

  it('Attempt to make empty db and write to', () => {
    const actual = db.append(entry)
    expect(actual).to.be.equal(entry)
  })
  it('Atttempt to get from current database', () => {
    const actual = db.get()
    expect(actual).deep.equal({ logs: [entry] })
  })
  after(async () => {
    console.log('unlinking')
    fs.unlinkSync(path.join(__dirname, 'logsTest.db'))
  })
})
