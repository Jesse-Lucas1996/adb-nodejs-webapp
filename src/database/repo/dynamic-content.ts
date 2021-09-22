import NeDB from 'nedb-promises'

export type DynamicContent = {
  id: string
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

  const update = async ({
    id,
    title,
    url,
  }: DynamicContent): Promise<DynamicContent> => {
    const updated = await datastore.update<DynamicContent>(
      {
        id,
      },
      {
        id,
        title,
        url,
      },
      {
        returnUpdatedDocs: true,
      }
    )
    return updated
  }

  const append = async ({
    id,
    title,
    url,
  }: DynamicContent): Promise<DynamicContent> => {
    const document = await datastore.insert<DynamicContent>({
      id,
      title,
      url,
    })
    return document
  }

  const remove = async (id: string): Promise<void> => {
    await datastore.remove({ id }, { multi: true })
  }

  return {
    get,
    getAll,
    update,
    append,
    remove,
  }
}
