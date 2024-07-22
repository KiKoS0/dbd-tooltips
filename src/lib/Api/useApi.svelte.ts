import type { ApiPathKey } from './types'
import { defaultJsonFetcher } from './utils'

export const useApi = <R>(path: string | undefined) => {
  let data: R | undefined = $state(undefined)

  const fetcher = defaultJsonFetcher as (url: ApiPathKey) => Promise<R>

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
