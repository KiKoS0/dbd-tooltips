<script lang="ts">
  import { currentGameStateStore } from '../Stores/CurrentGameStateStore.svelte'
  import { visualStore } from '../Stores/VisualStore.svelte'
  import type { PerkShowControl } from '../Stores/types'

  let { perkIdx, enabled = true } = $props<{
    perkIdx: PerkShowControl
    enabled?: boolean
  }>()

  let visualState = visualStore()
  const currentGameState = currentGameStateStore()

  function hoverOverPerk() {
    if (enabled) {
      visualState.setHoveredPerk(perkIdx)
      visualState.hideHelperInfo()
    }
  }

  function hoverOutOfPerk() {
    if (enabled) {
      visualState.clearHoveredPerk()
      visualState.hideChangelogs()
    }
  }

  function onClick() {
    if (enabled) {
      visualState.toggleChangelogs()
    }
  }
</script>

<!-- eslint-disable svelte/valid-compile  -->
<div
  on:mouseover={hoverOverPerk}
  on:mouseout={hoverOutOfPerk}
  on:click={onClick}
  on:keyup={onClick}
  class="diam"
  class:disabled={!currentGameState.perks[perkIdx]}
></div>

<!-- eslint-enable svelte/valid-compile  -->

<style>
  .diam {
    cursor: pointer;
    transition: box-shadow 0.25s ease-out;
    box-shadow: 3px 0px 20px #8100ff00;
    width: 42.5%;
    height: 42.5%;
    /* background: rgba(189, 8, 8, 0.3); */
  }
  .diam:hover {
    background: rgba(255, 255, 255, 0.3);
    transition: 0.1s background ease-out;
  }
  .disabled {
    visibility: hidden;
  }
</style>
