<script context="module" lang="ts">
  import type { AddonShowControl, PerkShowControl } from './types'

  let showPerk: PerkShowControl = $state(-1)
  let showAddon: AddonShowControl = $state(-1)

  export const showPerkAddonStore = () => {
    return {
      get hoveredPerk() {
        return showPerk
      },
      get hoveredAddon() {
        return showAddon
      },
      setHoveredPerk: (value: PerkShowControl) => (showPerk = value),
      setHoveredAddon: (value: AddonShowControl) => (showAddon = value),
      clearHoveredPerk: () => (showPerk = -1),
      clearHoveredAddon: () => (showAddon = -1)
    }
  }
</script>
