import type { AddonShowControl, PerkShowControl } from './types'

let showPerk: PerkShowControl = $state(-1)
let showAddon: AddonShowControl = $state(-1)
let showChangelogs = $state(false)

export const visualStore = () => {
  return {
    get hoveredPerk() {
      return showPerk
    },
    get hoveredAddon() {
      return showAddon
    },
    get changelogsShowing() {
      return showChangelogs
    },
    setHoveredPerk: (value: PerkShowControl) => (showPerk = value),
    setHoveredAddon: (value: AddonShowControl) => (showAddon = value),
    clearHoveredPerk: () => (showPerk = -1),
    clearHoveredAddon: () => (showAddon = -1),
    toggleChangelogs: () => (showChangelogs = !showChangelogs),
    hideChangelogs: () => (showChangelogs = false)
  }
}
