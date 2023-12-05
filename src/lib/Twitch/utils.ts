const twitch = window.Twitch.ext

export function log(msg: unknown) {
  if (import.meta.env.PROD) return
  console.log(msg)
  if (twitch && twitch.rig) {
    twitch.rig.log(msg)
  }
}

export const emptyPerks = [null, null, null, null]
export const emptyAddons = [null, null]

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
