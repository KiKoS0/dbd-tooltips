<script lang="ts">
  /* eslint-disable svelte/valid-compile */
  import type { AddonShowControl } from '../Stores/types'
  import { showInfo } from '../Stores/globals'
  import { visualStore } from '../Stores/VisualStore.svelte'
  import { currentGameStateStore } from '../Stores/CurrentGameStateStore.svelte'

  export let enabled = true
  export let addonIdx: AddonShowControl

  let visualState = visualStore()
  const currentGameState = currentGameStateStore()

  const hoverOverAddon = () => {
    if (!enabled) return
    visualState.setHoveredAddon(addonIdx)
    showInfo.update(() => false)
  }

  const hoverOutOfAddon = () => {
    if (!enabled) return
    visualState.setHoveredAddon(-1)
  }
</script>

<div
  on:mouseover={hoverOverAddon}
  on:mouseout={hoverOutOfAddon}
  class="diam"
  class:disabled={!currentGameState.addons[addonIdx]}
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
