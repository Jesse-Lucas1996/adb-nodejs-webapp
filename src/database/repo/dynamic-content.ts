import NeDB from 'nedb-promises'

export type DynamicContent = {
  id: string
  type: 'redirect' | 'embedded'
  title: string
  url: string
}

export function createDynamicContentRepo(path?: string) {
  const datastore = NeDB.create(path ?? './dynamic-content.db')
  datastore.ensureIndex({ fieldName: 'id', unique: true })

  const get = async (id: string): Promise<DynamicContent | undefined> => {
    const document = await datastore.findOne<DynamicContent>({ id })
    return document
  }

  const getAll = async (): Promise<DynamicContent[]> => {
    const documents = await datastore.find<DynamicContent>({})
    return documents
  }

  const update = async (content: DynamicContent): Promise<DynamicContent> => {
    const updated = await datastore.update<DynamicContent>(
      {
        id: content.id,
      },
      {
        id: content.id,
        type: content.type,
        title: content.title,
        url: content.url,
      },
      {
        upsert: true,
        returnUpdatedDocs: true,
      }
    )
    return updated
  }

  const remove = async (id: string): Promise<void> => {
    await datastore.remove({ id }, {})
  }

  return {
    get,
    getAll,
    update,
    remove,
  }
}
