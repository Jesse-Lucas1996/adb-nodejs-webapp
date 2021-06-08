import { expect } from 'chai'
import * as fs from 'fs'
import * as path from 'path'
import { LogEntry, createLogsRepo } from './logs'

describe('Logs repo test', () => {
  const entry: LogEntry = {
    name: 'adb',
    level: 'error',
    timestamp: '31/05/2021, 9:35:25 am',
    message: '"Hello"',
  }

  const db = createLogsRepo(path.join(__dirname, 'logs-test.db'))

  it('Attempt to make empty db and write to', async () => {
    const actual = await db.append(entry)
    expect(actual).to.be.deep.equal(entry)
  })
  it('Atttempt to get from current database', async () => {
    const actual = await db.getPaginated()
    expect(actual.logs).to.be.deep.equal([entry])
  })
  after(async () => {
    fs.unlinkSync(path.join(__dirname, 'logs-test.db'))
  })
})
