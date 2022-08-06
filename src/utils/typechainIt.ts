import { join } from 'path'

import { runTypeChain } from 'typechain'

export default async function typechainIt(
  contractNames: string[],
  source: string,
  outDir: string,
) {
  const allFiles = contractNames.map((contractName) =>
    join(source, contractName + '.json'),
  )
  await runTypeChain({
    cwd: process.cwd(),
    outDir: join(outDir, 'typechain'),
    target: 'ethers-v5',
    filesToProcess: allFiles,
    allFiles,
  })
}
