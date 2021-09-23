import * as dotnev from 'dotenv'
import { execSync } from 'child_process'

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
    throw new Error(`Environment variable ${variable} has not been defined`)
  }
  return v
}

type Config = {
  appEnv: string
  apiKey: string
  installId: string
  buildId: string
}

export const config: Readonly<Config> = {
  appEnv: getEnvVariable('appEnv'),
  apiKey: getEnvVariable('apiKey'),
  installId: getEnvVariable('installId'),
  buildId: execSync('git rev-parse --short HEAD').toString().replace('\n', ''),
}
