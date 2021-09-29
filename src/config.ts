import * as dotnev from 'dotenv'
import { execSync } from 'child_process'
import { RuntimeError } from './types'

let loaded = false
export function loadEnv() {
  if (!loaded) {
    dotnev.config()
    loaded = true
  }
}

export function getEnvVariable<T extends any = string>(variable: string): T {
  if (!loaded) {
    loadEnv()
  }
  const v = process.env[variable] as T
  if (v === undefined) {
    throw new RuntimeError(
      `Environment variable ${variable} has not been defined`
    )
  }
  return v
}

export type Config = {
  appEnv: string
  apiKey: string
  cookieSecret: string
  installId: string
  buildId: string
}

export const config: Readonly<Config> = {
  appEnv: getEnvVariable('appEnv'),
  apiKey: getEnvVariable('apiKey'),
  cookieSecret: getEnvVariable('cookieSecret'),
  installId: getEnvVariable('installId'),
  buildId: execSync('git rev-parse --short HEAD').toString().replace('\n', ''),
}
