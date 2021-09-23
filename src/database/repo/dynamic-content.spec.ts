import { expect } from 'chai'
import * as fs from 'fs'
import * as path from 'path'
import { createDynamicContentRepo, DynamicContent } from './dynamic-content'

describe('Dynamic content', () => {
  const item1: DynamicContent = {
    id: 'id-1',
    type: 'embedded',
    title: 'title-1',
    url: 'url-1',
  }

  const item2: DynamicContent = {
    id: 'id-2',
    type: 'redirect',
    title: 'title-2',
    url: 'url-2',
  }

  const db = createDynamicContentRepo(
    path.join(__dirname, 'dynamic-content-test.db')
  )

  it('Ensures appending and get', async () => {
    await db.update(item1)
    const { _id, ...actual } = (await db.get(item1.id)) as any
    expect(actual).to.be.deep.equal(item1)
  })

  it('Ensures appending and getAll', async () => {
    await db.update(item2)
    const entries = await db.getAll()
    const actual = entries.length
    expect(actual).to.be.equal(2)
  })

  it('Ensures updating', async () => {
    await db.update({
      id: item2.id,
      type: item2.type,
      title: 'title-3',
      url: 'url-3',
    })
    const { _id, ...actual } = (await db.get(item2.id)) as any
    expect(actual).to.be.deep.equal({
      id: item2.id,
      type: item2.type,
      title: 'title-3',
      url: 'url-3',
    })
  })

  it('Ensures deleting', async () => {
    await db.remove(item2.id)
    const entries = await db.getAll()
    const actual = entries.length
    expect(actual).to.be.deep.equal(1)
  })

  after(async () => {
    fs.unlinkSync(path.join(__dirname, 'dynamic-content-test.db'))
  })
})
