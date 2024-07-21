import type { DbdUIScale } from '../Twitch/types'
import type { AddonsLoadout, PerksLoadout } from './types'

let perks: PerksLoadout = $state([null, null, null, null])
let addons: AddonsLoadout = $state([null, null])
let hudSize: DbdUIScale = $state('100')

export const currentGameStateStore = () => {
  return {
    get perks() {
      return perks
    },
    get addons() {
      return addons
    },
    get hudSize() {
      return hudSize
    },
    setPerks: (newPerks: PerksLoadout) => (perks = newPerks),
    setAddons: (newAddons: AddonsLoadout) => (addons = newAddons),
    setHudSize: (newHudSize: DbdUIScale) => (hudSize = newHudSize)
  }
}
