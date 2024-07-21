<script lang="ts">
  import { fade } from 'svelte/transition'

  import type { AddonEntry, AddonShowControl } from '../Stores/types'
  import { emptyAddon } from '../utils.svelte'
  import { visualStore } from '../Stores/VisualStore.svelte'
  import { mainGameStore } from '../Stores/MainGameStore'
  import { currentGameStateStore } from '../Stores/CurrentGameStateStore.svelte'

  export let number: AddonShowControl

  let addonData: Partial<AddonEntry> | undefined = undefined
  let gifSrc: string | undefined = undefined

  let visualState = visualStore()
  const gameStore = mainGameStore()
  const currentGameState = currentGameStateStore()

  function imageUpdate(path: string, absolute = true) {
    const imageRelativePath = path.replace(/^data\//, '')

    const updated = absolute
      ? `https://${import.meta.env?.VITE_CDN_HOST}/${imageRelativePath}`
      : imageRelativePath
    gifSrc = updated
  }

  const onAddonClick = () => {
    console.log(`Addon ${number} clicked`)
    visualState.setHoveredAddon(number)
  }

  $: {
    let addon = currentGameState.addons[number]

    if (addon && gameStore.killersMetadata) {
      const addonDic = gameStore.killersMetadata[addon.killerId].addons

      addonData = addonDic[addon.id] ? addonDic[addon.id] : emptyAddon()

      imageUpdate(
        addonData.img_path as string,
        addonData.img_path !== emptyAddon().img_path
      )
    }
  }

  const getImageStyle = () =>
    `background-image: url("${gifSrc}");background-size: 20vh;`
</script>

<div class:disabled={!currentGameState.addons[number]} in:fade class="diam">
  <div
    class="image-container"
    style={gifSrc ? getImageStyle() : ''}
    on:click={onAddonClick}
    on:keyup={onAddonClick}
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
