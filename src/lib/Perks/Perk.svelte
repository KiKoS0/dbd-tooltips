<script lang="ts">
  import {
    perkStore,
    showChangelogs,
    showInfo,
    showPerk
  } from '../Stores/globals'
  import type { PerkShowControl } from '../Stores/types'

  export let enabled = true
  export let perkIdx: PerkShowControl

  function hoverOverPerk() {
    if (enabled) {
      showPerk.update((_) => perkIdx)
      showInfo.update((_) => false)
    }
  }

  function hoverOutOfPerk() {
    if (enabled) {
      showPerk.update((_) => -1)
      showChangelogs.update((_) => false)
    }
  }

  function onClick() {
    if (enabled) {
      showChangelogs.update((val) => !val)
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
  class:disabled={!$perkStore[perkIdx]}
/>

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
