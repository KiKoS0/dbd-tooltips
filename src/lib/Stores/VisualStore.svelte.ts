import type { AddonShowControl, PerkShowControl } from './types'

let showPerk: PerkShowControl = $state(-1)
let showAddon: AddonShowControl = $state(-1)
let showChangelogs = $state(false)
let showHelperInfo = $state(false)
let hudPinned = $state(false)

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
    get helperInfoShowing() {
      return showHelperInfo
    },
    get isHudPinned() {
      return hudPinned
    },

    setHoveredPerk: (value: PerkShowControl) => (showPerk = value),
    setHoveredAddon: (value: AddonShowControl) => (showAddon = value),

    clearHoveredPerk: () => {
      if (!hudPinned) {
        showPerk = -1
      }
    },
    clearHoveredAddon: () => {
      if (!hudPinned) {
        showAddon = -1
      }
    },

    pinHud: () => (hudPinned = true),
    unpinHud: () => {
      hudPinned = false
      showPerk = -1
      showAddon = -1
      showChangelogs = false
    },

    toggleChangelogs: () => (showChangelogs = !showChangelogs),
    hideChangelogs: () => (showChangelogs = false),

    showHelperInfo: (maxDelayMs = 5000) => {
      showHelperInfo = true
      setTimeout(() => (showHelperInfo = false), maxDelayMs)
    },
    hideHelperInfo: () => (showHelperInfo = false)
  }
}
