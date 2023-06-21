<script lang="ts">
  import { fade } from 'svelte/transition'
  import {
    perkStore,
    killerPerksData,
    survivorPerksData,
    showPerk
  } from '../Stores/globals'
  import { log } from '../Twitch/utils'
  import type { PerkEntry, PerkShowControl } from '../Stores/types'

  export let number: PerkShowControl

  let hoveredPerkInfo: Partial<PerkEntry> | undefined = undefined
  let gifSrc: string | undefined = undefined

  $: survivor_perks = $survivorPerksData
  $: killer_perks = $killerPerksData
  const fallbackCdnHost = import.meta.env?.VITE_FALLBACK_CDN_HOST

  const blacklistedImgs = new Set()

  const imageUpdate = (path: string) => {
    const newImage = new Image()
    const fallback_url = `https://${fallbackCdnHost}/${path}`
    if (blacklistedImgs.has(path)) {
      path = fallback_url
    } else {
      newImage.onerror = (e, s) => {
        blacklistedImgs.add(path)
        gifSrc = fallback_url
      }
    }

    newImage.src = path
    // @ts-expect-error: // TODO: Find a better way to preload the image.
    window[path] = newImage
    gifSrc = path
  }

  const hoverOverPerk = () => {
    log(`Perk ${number} clicked`)
    showPerk.update((_) => number)
  }

  $: {
    let hPerk = $perkStore[number]
    log(hPerk)
    if (hPerk && survivor_perks && killer_perks) {
      const perk_dic =
        hPerk.actor === 'survivor' ? survivor_perks : killer_perks

      if (perk_dic[hPerk.id]) {
        hoveredPerkInfo = perk_dic[hPerk.id]

        if (hoveredPerkInfo?.gif)
          imageUpdate(hoveredPerkInfo['gif'].replace('data', 'images'))
      } else {
        // No data for perk available, probably need to update the json files.
        hoveredPerkInfo = {
          gif: './images/perks/empty_perk.png',
          name: 'Unknown Perk',
          description:
            "Oups I don't actually know what perk is that, please force refresh the page or contact the developers if that doesn't help.",
          character: 'Unknown'
        }
      }
    }
  }

  const getImageStyle = () => `background-image: url("${gifSrc}");`
</script>

<div class:disabled={!$perkStore[number]} in:fade class="diam">
  {#if hoveredPerkInfo}
    <div
      class="image-container"
      style={gifSrc ? getImageStyle() : ''}
      on:click={hoverOverPerk}
      on:keyup={hoverOverPerk}
    />
  {/if}
</div>

<!-- eslint-disable svelte/valid-compile -->
<style>
  .disabled {
    visibility: hidden;
  }

  .diam {
    width: 256px;
    height: 256px;
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
