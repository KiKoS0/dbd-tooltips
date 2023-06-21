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
