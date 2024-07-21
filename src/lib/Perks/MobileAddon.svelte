<script lang="ts">
  import { fade } from 'svelte/transition'

  import type { AddonEntry, AddonShowControl } from '../Stores/types'
  import { emptyAddon, removeDataPrefixInPath } from '../utils.svelte'
  import { visualStore } from '../Stores/VisualStore.svelte'
  import { mainGameStore } from '../Stores/MainGameStore'
  import { currentGameStateStore } from '../Stores/CurrentGameStateStore.svelte'

  const cdnHost = import.meta.env?.VITE_CDN_HOST

  let { number } = $props<{ number: AddonShowControl }>()

  let visualState = visualStore()
  const gameStore = mainGameStore()
  const currentGameState = currentGameStateStore()

  const onAddonClick = () => {
    console.log(`Addon ${number} clicked`)
    visualState.setHoveredAddon(number)
  }

  let addonData: Partial<AddonEntry> | undefined = $derived.by(() => {
    let addon = currentGameState.addons[number]

    if (!addon || !gameStore.killersMetadata) {
      return undefined
    }

    const addonDic = gameStore.killersMetadata[addon.killerId].addons
    return addonDic[addon.id] ? addonDic[addon.id] : emptyAddon()
  })

  let gifSrc: string | undefined = $derived(
    addonData?.img_path &&
      `https://${cdnHost}/${removeDataPrefixInPath(addonData?.img_path)}`
  )

  const getImageStyle = () =>
    `background-image: url("${gifSrc}");background-size: 20vh;`
</script>

<div class:disabled={!currentGameState.addons[number]} in:fade class="diam">
  <div
    class="image-container"
    style={gifSrc ? getImageStyle() : ''}
    onclick={onAddonClick}
    onkeyup={onAddonClick}
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
    width: 20vh;
    height: 20vh;
    flex-shrink: 0;
  }

  .image-container {
    width: 100%;
    height: 100%;
    background-position: center center;
    background-repeat: no-repeat;
  }

  .addon_info_desc :global(img) {
    vertical-align: middle !important;
  }
</style>
