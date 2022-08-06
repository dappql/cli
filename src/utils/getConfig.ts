import { existsSync } from 'fs'
import { join } from 'path'

import { RUNNING_DIRECTORY } from './constants'

const CONFIG_PATH = join(RUNNING_DIRECTORY, 'dapp.config.js')

export type Config = {
  contracts: Record<string, string> | Record<string, Record<number, string>>
  abiSourcePath: string
  targetPath: string
}

export default function getConfig() {
  if (!existsSync(CONFIG_PATH)) {
    throw new Error('Config file (dapp.config.js) not found!')
  }

  return require(CONFIG_PATH) as Config
}
