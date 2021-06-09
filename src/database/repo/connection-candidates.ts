import NeDB from 'nedb-promises'

type StoredCandidates = {
  version: string
  candidates: string[]
}

export function createConnectionCandidatesRepo(path?: string) {
  const datastore = NeDB.create(path ?? './connection-candidates.db')
  const version = 'current'

  const update = async (candidates: string[]): Promise<string[]> => {
    const stored = await datastore.update<StoredCandidates>(
      {
        version,
      },
      {
        version,
        candidates: candidates ?? [],
      },
      {
        upsert: true,
        returnUpdatedDocs: true,
      }
    )
    return stored.candidates
  }

  const get = async (): Promise<string[]> => {
    const document = await datastore.findOne<StoredCandidates>({
      version,
    })
    return document?.candidates ?? []
  }

  return {
    update,
    get,
  }
}
