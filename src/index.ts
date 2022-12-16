import * as figlet from 'figlet'

import clean from './utils/clean'
import getConfig from './utils/getConfig'
import logger, { Severity } from './utils/logger'
import typechainIt from './utils/typechainIt'

import { createContractMethodsTypes } from './templates/createContractMethodsTypes'
import { createGetContractFunctions } from './templates/createGetContractFunctions'
import { createIndex } from './templates/createIndex'

async function main() {
  logger(figlet.textSync('DappQL', { horizontalLayout: 'full' }), Severity.info)
  logger('Querying data from smart-contracts made easy.\n', Severity.info)

  logger('Loading config file ...\n', Severity.warning)
  const config = getConfig()

  clean(config.targetPath)

  const contracts = Object.keys(config.contracts).sort()

  logger(
    `Generating contract types for: ${contracts
      .map((c) => `\n\t- ${c}`)
      .join('')}\n`,
  )

  await typechainIt(contracts, config.abiSourcePath, config.targetPath)
  createGetContractFunctions(config.contracts, config.targetPath)
  createContractMethodsTypes(contracts, config.targetPath)

  logger('Generating DappQL code ...\n')
  createIndex(contracts, config.targetPath)

  logger('\n\nDone! 🎉\n\n', Severity.success)
}

main().catch((e) => logger(e.message, Severity.error))
