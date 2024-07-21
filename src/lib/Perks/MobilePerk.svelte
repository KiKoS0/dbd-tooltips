<script lang="ts">
  import { fade } from 'svelte/transition'
  import { visualStore } from '../Stores/VisualStore.svelte'
  import type { PerkEntry, PerkShowControl } from '../Stores/types'
  import { emptyPerk, removeDataPrefixInPath } from '../utils.svelte'
  import { mainGameStore } from '../Stores/MainGameStore'
  import { currentGameStateStore } from '../Stores/CurrentGameStateStore.svelte'

  const cdnHost = import.meta.env?.VITE_CDN_HOST

  let { number } = $props<{ number: PerkShowControl }>()

  const gameStore = mainGameStore()
  const currentGameState = currentGameStateStore()

  let visualState = visualStore()

  const onPerkClick = () => {
    console.log(`Perk ${number} clicked`)
    visualState.setHoveredPerk(number)
  }

  let perkData: Partial<PerkEntry> | undefined = $derived.by(() => {
    let hPerk = currentGameState.perks[number]

    if (!hPerk || !gameStore.survivorsData || !gameStore.killersData) {
      return undefined
    }

    const perkDic =
      hPerk.actor === 'survivor'
        ? gameStore.survivorsData
        : gameStore.killersData

    return perkDic[hPerk.id] ? perkDic[hPerk.id] : emptyPerk()
  })

  let gifSrc: string | undefined = $derived(
    perkData?.gif &&
      `https://${cdnHost}/${removeDataPrefixInPath(perkData.gif)}`
  )

  const getImageStyle = () =>
    `background-image: url("${gifSrc}");background-size: 220px;`
</script>

<div class:disabled={!currentGameState.perks[number]} in:fade class="diam">
  <div
    class="image-container"
    style={gifSrc ? getImageStyle() : ''}
    onclick={onPerkClick}
    onkeyup={onPerkClick}
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
