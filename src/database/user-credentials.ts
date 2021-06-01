import Database from 'simplest.db'
import crypto from 'crypto'

export function createUserCredentialsRepo(path?: string) {
  const db = new Database({
    path: path ?? './user-credentials.db',
    type: 'SQLite',
    check: true,
    cacheType: 0,
  })

  let defaultHashedPassword = crypto
    .createHash('sha256')
    .update('PixelSamsungNetflixACoolBossAHunkOfAMan')
    .digest('hex')

  if (!db.keys.includes('admin')) {
    db.set('admin', defaultHashedPassword)
  }

  const updateCredentials = (password: string) =>
    db.set('admin', crypto.createHash('sha256').update(password).digest('hex'))

  const validateCredentials = (username: string, password: string) => {
    if (!db.keys.includes(username)) {
      return {
        isValid: false,
        reason: 'Unknown user',
      }
    }
    if (
      db.get(username) ===
      crypto.createHash('sha256').update(password).digest('hex')
    ) {
      return {
        isValid: true,
      }
    }
    return {
      isValid: false,
      reason: 'Invalid credentials',
    }
  }
  return {
    updateCredentials,
    validateCredentials,
  }
}
