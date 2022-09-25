import { writeFileSync } from 'fs'
import { join } from 'path'
import { RUNNING_DIRECTORY } from '../utils/constants'

export function createIndex(contracts: string[], target: string) {
  const path = join(RUNNING_DIRECTORY, target, 'index.tsx')

  const template = `/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ComponentType, ReactElement, useMemo } from 'react'

import { QueryParams, useCalls, useEthers } from '@usedapp/core'

import { Requests, ${contracts.join('Call, ')}Call } from './requests'

export const call = {
${contracts.map((c) => `  ${c}: ${c}Call`).join(',\n')},
}

export type QueryData<T extends Requests> = {
  [K in keyof T]: NonNullable<T[K]['returnType']>
}

export default function useQuery<T extends Requests>(
  requests: T,
  queryParams?: QueryParams,
): {
  data: { [K in keyof T]: NonNullable<T[K]['returnType']> }
  isLoading: boolean
  error: Error | undefined
} {
  const { chainId } = useEthers()
  const callKeys = Object.keys(requests) as (keyof T)[]
  const calls = callKeys.map((c) => ({
    contract: requests[c].contract(queryParams?.chainId || chainId),
    method: requests[c].method,
    args: requests[c].args,
  }))
  const result = useCalls(calls, queryParams)

  const error = result.find((r) => r?.error)?.error
  const loadedValues = result.filter((result) => result?.value)
  const isLoading = loadedValues.length !== calls.length

  const data = useMemo(() => {
    const requestWithData = {} as {
      [K in keyof T]: NonNullable<T[K]['returnType']>
    }
    callKeys.forEach((k, index) => {
      requestWithData[k] = result[index]?.value?.[0]
    })
    return requestWithData
  }, [result, callKeys])

  return { data, isLoading, error }
}

export type ErrorMessageProps = { message?: string }

export type ComponentsProps<T extends Requests> = {
  errorComponent?: ComponentType<ErrorMessageProps>
  loadingComponent?: ComponentType<any>
} & (
  | {
      component: ComponentType<{
        data: {
          [K in keyof T]: NonNullable<T[K]['returnType']>
        }
      }>
      children?: (data: {
        [K in keyof T]: NonNullable<T[K]['returnType']>
      }) => ReactElement<any, any>
    }
  | {
      component?: ComponentType<{
        data: {
          [K in keyof T]: NonNullable<T[K]['returnType']>
        }
      }>
      children: (data: {
        [K in keyof T]: NonNullable<T[K]['returnType']>
      }) => ReactElement<any, any>
    }
)

export type QueryContainerProps<T extends Requests> = {
  query: T
  queryParams?: QueryParams
} & ComponentsProps<T>

function SafeQueryContainer<T extends Requests>(props: QueryContainerProps<T>) {
  const { data, error, isLoading } = useQuery(props.query, props.queryParams)

  if (error) {
    return props.errorComponent ? <props.errorComponent message={error.message} /> : null
  }

  if (isLoading) {
    return props.loadingComponent ? <props.loadingComponent /> : null
  }

  return props.component ? <props.component data={data} /> : props.children?.(data) || null
}

export function QueryContainer<T extends Requests>(props: QueryContainerProps<T>) {
  const { chainId } = useEthers()

  if (!chainId) {
    return props.errorComponent ? <props.errorComponent message="Invalid Network" /> : null
  }
  return <SafeQueryContainer<T> {...props} />
}

export type AccountQueryContainerProps<T extends Requests> = {
  query: (account: string) => T
  queryParams?: QueryParams
  noAccountComponent?: ComponentType<any>
} & ComponentsProps<T>

export function AccountQueryContainer<T extends Requests>(props: AccountQueryContainerProps<T>) {
  const { account } = useEthers()

  const { noAccountComponent: NoAccountComponent, query, ...other } = props

  if (!account) {
    return NoAccountComponent ? <NoAccountComponent /> : null
  }

  const queryWithAccount = query(account)
  return <QueryContainer<T> {...other} query={queryWithAccount} />
}


`
  writeFileSync(path, template)
}
