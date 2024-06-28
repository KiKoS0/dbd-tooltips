export function log(msg: unknown) {
  if (import.meta.env.PROD) return
  console.log(msg)
}

export const EMPTY_PERKS = [null, null, null, null]
export const EMPTY_ADDONS = [null, null]

export const API_ENDPOINT = `${import.meta.env.VITE_API_URL}/api/v1/`
log(`EBS ENDPOINT: ${API_ENDPOINT}`)

export const fetchData = async <T>(
  url: string,
  updateFn: (data: (prev: T) => T) => void
) => {
  const response = await fetch(
    `https://${import.meta.env?.VITE_CDN_HOST}/${url}`
  )
  const data = (await response.json()) as T
  updateFn(() => data)
}
