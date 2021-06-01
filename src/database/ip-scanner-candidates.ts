import Database from 'simplest.db'

export function createIpScannerCandidatesRepo(path?: string) {
  const db = new Database({
    path: path ?? './ip-scanner-candidates.db',
    type: 'SQLite',
    check: true,
    cacheType: 0,
  })

  const update = (candidates: string[]) => db.set('0', candidates)

  const get = (): string[] => db.get('0') ?? []

  return {
    update,
    get,
  }
}
