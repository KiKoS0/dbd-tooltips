<script lang="ts">
  import { fade } from 'svelte/transition'
  import {
    addonStore,
    killersData as killersStoreData,
    showAddon
  } from '../Stores/globals'
  import { log } from '../Twitch/utils'
  import type { AddonEntry, AddonShowControl } from '../Stores/types'
  import { EMPTY_ADDON } from '../utils'

  export let number: number

  let addonData: Partial<AddonEntry> | undefined = undefined
  let gifSrc: string | undefined = undefined

  $: killersData = $killersStoreData

  function imageUpdate(path: string, absolute = true) {
    const imageRelativePath = path.replace(/^data\//, '')

    const updated = absolute
      ? `https://${import.meta.env?.VITE_CDN_HOST}/${imageRelativePath}`
      : imageRelativePath
    gifSrc = updated
  }

  const onAddonClick = () => {
    log(`Addon ${number} clicked`)
    showAddon.update((_) => number as AddonShowControl)
  }

  $: {
    let addon = $addonStore[number]

    if (addon && killersData) {
      const addonDic = killersData[addon.killerId].addons

      addonData = addonDic[addon.id] ? addonDic[addon.id] : EMPTY_ADDON

      imageUpdate(
        addonData.img_path as string,
        addonData.img_path !== EMPTY_ADDON.img_path
      )
    }
  }

  const getImageStyle = () =>
    `background-image: url("${gifSrc}");background-size: 20vh;`
</script>

<div class:disabled={!$addonStore[number]} in:fade class="diam">
  <div
    class="image-container"
    style={gifSrc ? getImageStyle() : ''}
    on:click={onAddonClick}
    on:keyup={onAddonClick}
    role="button"
    tabindex="0"
  />
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
