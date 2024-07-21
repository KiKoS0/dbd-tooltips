import type { SWRKey } from './types'

export const defaultJsonFetcher = async <D>(url: SWRKey): Promise<D> => {
  const response = await fetch(url)
  if (!response.ok) throw new Error('Not a 2XX response.')
  return response.json()
}
