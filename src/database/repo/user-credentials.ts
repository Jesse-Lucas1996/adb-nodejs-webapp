import NeDB from 'nedb-promises'
import crypto from 'crypto'

type StoredCredentials = {
  username: string
  hash: string
}

export function createUserCredentialsRepo(path?: string) {
  const datastore = NeDB.create(path ?? './user-credentials.db')
  const defaultUsername = 'admin'
  const defaultHash = crypto
    .createHash('sha256')
    .update('CloudTV1')
    .digest('hex')

  const update = async (password: string) => {
    const hash = crypto.createHash('sha256').update(password).digest('hex')
    await datastore.update<StoredCredentials>(
      {
        username: defaultUsername,
      },
      {
        username: defaultUsername,
        hash,
      },
      {
        upsert: true,
      }
    )
  }

  const validate = async (username: string, password: string) => {
    const credentials = await datastore.findOne<StoredCredentials>({
      username,
    })

    if (!credentials && username === defaultUsername) {
      return defaultHash ===
        crypto.createHash('sha256').update(password).digest('hex')
        ? {
            isValid: true,
          }
        : {
            isValid: false,
            reason: 'Invalid credentials',
          }
    }

    if (!credentials) {
      return {
        isValid: false,
        reason: 'User does not exist',
      }
    }

    return credentials.hash ===
      crypto.createHash('sha256').update(password).digest('hex')
      ? {
          isValid: true,
        }
      : {
          isValid: false,
          reason: 'Invalid credentials',
        }
  }

  return {
    update,
    validate,
  }
}
