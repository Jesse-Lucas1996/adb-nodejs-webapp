import Database from 'simplest.db'

export function createIpScannerCandidatesRepo(path?: string) {
  const db = new Database({
    path: path ?? './ip-scanner-candidates.db',
    type: 'SQLite',
    check: true,
    cacheType: 0,
  })

  const index = '0'

  if (!db.get(index)) {
    db.set(index, [])
  }

  const update = (candidates: string[]): string[] => db.set(index, candidates)

  const get = (): string[] => db.get(index)

  return {
    update,
    get,
  }
}
