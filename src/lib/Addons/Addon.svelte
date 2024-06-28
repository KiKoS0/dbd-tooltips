<script lang="ts">
  /* eslint-disable svelte/valid-compile */
  import type { AddonShowControl } from '../Stores/types'
  import { addonStore, showInfo } from '../Stores/globals'
  import { showPerkAddonStore } from '../Stores/ShowPerkAddonStore.svelte'

  export let enabled = true
  export let addonIdx: AddonShowControl

  let perkAddonStore = showPerkAddonStore()

  const hoverOverAddon = () => {
    if (!enabled) return
    perkAddonStore.setHoveredAddon(addonIdx)
    showInfo.update(() => false)
  }

  const hoverOutOfAddon = () => {
    if (!enabled) return
    perkAddonStore.setHoveredAddon(-1)
  }
</script>

<div
  on:mouseover={hoverOverAddon}
  on:mouseout={hoverOutOfAddon}
  class="diam"
  class:disabled={!$addonStore[addonIdx]}
></div>

<style>
  .diam {
    cursor: pointer;
    transition: box-shadow 0.25s ease-out;
    box-shadow: 3px 0px 20px #8100ff00;
    width: 42.5%;
    height: 42.5%;
    /* background: rgba(223, 4, 4, 0.397); */
  }
  .diam:hover {
    background: rgba(255, 255, 255, 0.3);
    transition: 0.1s background ease-out;
  }
  .disabled {
    visibility: hidden;
  }
</style>
