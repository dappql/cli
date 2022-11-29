import { writeFileSync } from 'fs'
import { join } from 'path'
import { RUNNING_DIRECTORY } from '../utils/constants'

export function createProvider(target: string) {
  const path = join(RUNNING_DIRECTORY, target, 'DappQLProvider.tsx')

  const template = `/* Autogenerated file. Do not edit manually. */
  /* tslint:disable */
  /* eslint-disable */
  
  import { createContext, ReactElement, useContext } from 'react'
  
  import { QueryParams } from '@usedapp/core'
  
  const Context = createContext<{ queryParams?: QueryParams }>({})
  
  export default function DappQLProvider(props: { children: ReactElement<any, any>; queryParams?: QueryParams }) {
    return <Context.Provider value={{ queryParams: props.queryParams }}>{props.children}</Context.Provider>
  }
  
  export function useDappQL() {
    return useContext(Context)
  }
  
`
  writeFileSync(path, template)
}