import type { ApiPathKey } from './types'

export const defaultJsonFetcher = async <D>(url: ApiPathKey): Promise<D> => {
  const response = await fetch(url)
  if (!response.ok) throw new Error('Not a 2XX response.')
  return response.json()
}
