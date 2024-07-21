import type { SWRKey } from './types'
import { defaultJsonFetcher } from './utils'

export const useApi = <R>(path: string | undefined) => {
  let data: R | undefined = $state(undefined)

  const fetcher = defaultJsonFetcher as (url: SWRKey) => Promise<R>

  if (path) {
    fetcher(path).then((result) => {
      data = result
    })
  }

  return {
    get data() {
      return data
    }
  }
}
