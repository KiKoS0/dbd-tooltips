export const EMPTY_PERKS = [null, null, null, null]
export const EMPTY_ADDONS = [null, null]

export const API_ENDPOINT = `${import.meta.env.VITE_API_URL}/api/v1/`
console.log(`EBS ENDPOINT: ${API_ENDPOINT}`)

export const fetchData = async <T>(
  path: string,
  updateFn: (data: (prev: T) => T) => void
) => {
  const response = await fetch(getDataUrl(path))
  const data = (await response.json()) as T
  updateFn(() => data)
}

export const getDataUrl = (path: string) =>
  `https://${import.meta.env?.VITE_CDN_HOST}/${path}`
