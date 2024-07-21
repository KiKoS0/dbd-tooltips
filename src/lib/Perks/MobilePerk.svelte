<script lang="ts">
  import { fade } from 'svelte/transition'
  import { showPerkAddonStore } from '../Stores/ShowPerkAddonStore.svelte'
  import type { PerkEntry, PerkShowControl } from '../Stores/types'
  import { EMPTY_PERK } from '../utils'
  import { mainGameStore } from '../Stores/MainGameStore'
  import { currentGameStateStore } from '../Stores/CurrentGameStateStore.svelte'

  export let number: PerkShowControl

  let perkData: Partial<PerkEntry> | undefined = undefined
  let gifSrc: string | undefined = undefined

  const gameStore = mainGameStore()
  const currentGameState = currentGameStateStore()

  let perkAddonStore = showPerkAddonStore()

  function imageUpdate(path: string, absolute = true) {
    const imageRelativePath = path.replace(/^data\//, '')

    const updated = absolute
      ? `https://${import.meta.env?.VITE_CDN_HOST}/${imageRelativePath}`
      : imageRelativePath
    gifSrc = updated
  }

  const onPerkClick = () => {
    console.log(`Perk ${number} clicked`)
    perkAddonStore.setHoveredPerk(number)
  }

  $: {
    let hPerk = currentGameState.perks[number]

    if (hPerk && gameStore.survivorsData && gameStore.killersData) {
      const perkDic =
        hPerk.actor === 'survivor'
          ? gameStore.survivorsData
          : gameStore.killersData

      perkData = perkDic[hPerk.id] ? perkDic[hPerk.id] : EMPTY_PERK
      imageUpdate(perkData.gif as string, perkData.gif !== EMPTY_PERK.gif)
    }
  }

  const getImageStyle = () =>
    `background-image: url("${gifSrc}");background-size: 220px;`
</script>

<div class:disabled={!currentGameState.perks[number]} in:fade class="diam">
  <div
    class="image-container"
    style={gifSrc ? getImageStyle() : ''}
    on:click={onPerkClick}
    on:keyup={onPerkClick}
    role="button"
    tabindex="0"
  ></div>
</div>

<!-- eslint-disable svelte/valid-compile  -->
<style>
  .disabled {
    visibility: hidden;
  }

  .diam {
    width: 220px;
    height: 220px;
    flex-shrink: 0;
  }

  .image-container {
    width: 100%;
    height: 100%;
    background-position: center center;
    transform: rotate(-45deg) scale(1.5);
  }

  .perk_info_desc :global(img) {
    vertical-align: middle !important;
  }
</style>
