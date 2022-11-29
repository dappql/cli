import { writeFileSync } from 'fs'
import { join } from 'path'
import { RUNNING_DIRECTORY } from '../utils/constants'
import touchDirectory from '../utils/touchDirectory'

export function createHooks(contracts: string[], target: string) {
  const dir = join(RUNNING_DIRECTORY, target, 'hooks')
  touchDirectory(dir)

  contracts.forEach((c) => {
    const path = join(dir, `use${c}.ts`)

    const template = `/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
  
import { useMemo } from 'react'

import {
  CallResult,
  useCall,
  useContractFunction,
  useEthers,
  QueryParams,
} from '@usedapp/core'
import { ContractFunctionNames } from '@usedapp/core/dist/esm/src/model/types'

import getContract from '../getContract'
import { ${c}MethodNames } from '../requests'
import { ${c} } from '../typechain'
import { useDappQL } from '../DappQLProvider'

export function use${c}Call<M extends ${c}MethodNames>(
  method: M,
  args: Parameters<${c}['functions'][M]>,
  queryParams?: QueryParams
) {
  const context = useDappQL()
  const { chainId } = useEthers()
  const _queryParams = { ...(context.queryParams || {}), ...(queryParams || {}) }
  const _chainId = _queryParams?.chainId || chainId

  const contract = useMemo(() => getContract('${c}', _chainId), [_chainId])

  const { value, error } = (useCall(
    {
      contract,
      method,
      args,
    }, 
    _queryParams,
  ) as CallResult<${c}, M>) ?? {
    value: undefined,
    error: undefined,
  }

  return [value?.[0], error, !value] as [
    Awaited<ReturnType<${c}['functions'][M]>>[0] | undefined,
    Error | undefined,
    boolean,
  ]
}

type ${c}Functions = ContractFunctionNames<${c}>
export function use${c}Function(name: ${c}Functions, transactionName?: string) {
  const { chainId } = useEthers()

  const contract = useMemo(() => getContract('${c}', chainId), [chainId])

  const transaction = useContractFunction(contract, name, {
    transactionName: transactionName || name,
  })
  return transaction
}
`
    writeFileSync(path, template)
  })
}
