<script lang="ts">
  import { fade } from 'svelte/transition'
  import { addonStore, hudSize } from '../Stores/globals'
  import { onDestroy } from 'svelte'

  import Description from '../shared/Description.svelte'
  import type { Addon, AddonEntry } from '../Stores/types'
  import type { DbdUIScale } from '../Twitch/types'
  import type { Nullable } from '../types'
  import { mainGameStore } from '../Stores/mainGameStore'

  const gameStore = mainGameStore()

  const unsubscribe = addonStore.subscribe((value) => {
    if (value && value.constructor === Array) {
      // Preloading perks gifs
      value.forEach((item) => {
        if (item && gameStore.killersMetadata) {
          const addon_dic = gameStore.killersMetadata[item.killerId]['addons']

          if (item.id in addon_dic) {
            // Preload only when it's available obviously
            const img = addon_dic[item.id].img_path
            const newImage = new Image()
            newImage.src = img
            // @ts-expect-error: // TODO: Find a better way to preload the image.
            window[img] = newImage
          }
        }
      })
    }
  })

  onDestroy(unsubscribe)

  export let hoveredAddon: Nullable<Addon> = null
  export let mobileMode = false
  export let landscapeMode = false
  export let disabled = false

  let hoveredPerkInfo:
    | (Partial<AddonEntry> & {
        character?: string
        gif?: string
        icon_alt?: string
      })
    | undefined = undefined
  let gifSrc: string | undefined = undefined

  $: {
    let hAddon = hoveredAddon
    if (hAddon && gameStore.killersMetadata) {
      const perk_dic = gameStore.killersMetadata

      if (perk_dic[hAddon.killerId]) {
        hoveredPerkInfo = {
          character: perk_dic[hAddon.killerId].name,
          ...perk_dic[hAddon.killerId].addons[hAddon.id]
        }

        if (hoveredPerkInfo?.img_path) imageUpdate(hoveredPerkInfo.img_path)
      } else {
        // No data for perk available, probably need to update the json files.
        hoveredPerkInfo = {
          gif: './images/empty_perk.png',
          name: 'Unknown Addon',
          description:
            "Oups I don't actually know what addon is that, please force refresh the page or contact the developers if that doesn't help.",
          character: 'Unknown'
        }
        imageUpdate(hoveredPerkInfo.gif as string)
        console.log(hoveredPerkInfo)
      }
    }
  }

  const scaleToPositions = {
    '70': [12, 7.5],
    '75': [12, 8.5],
    '80': [13, 9],
    '85': [14, 9.5],
    '90': [15, 10],
    '95': [16, 10.5],
    '100': [16, 11]
  }
  function overridePosScale(hudSize: DbdUIScale) {
    if (!mobileMode && hudSize) {
      return `bottom: ${scaleToPositions[hudSize][0]}% !important; left: ${scaleToPositions[hudSize][1]}% !important;`
    } else return ''
  }

  function imageUpdate(path: string) {
    const imageRelativePath = path.replace(/^data\//, '')
    gifSrc = `https://${import.meta.env?.VITE_CDN_HOST}/${imageRelativePath}`
    forceRerender = {}
  }

  let forceRerender = {}
</script>

{#if !disabled}
  <div
    style={overridePosScale($hudSize)}
    transition:fade
    class={mobileMode ? 'perk_info_hud_mobile' : 'perk_info_hud'}
  >
    {#if hoveredPerkInfo}
      <div
        class={mobileMode ? 'perk_info_meta_mobile' : 'perk_info_meta'}
        class:perk_info_meta_mobile_lan={mobileMode && landscapeMode}
      >
        <div
          class="perk_info_img"
          class:perk_info_img_lan={mobileMode && landscapeMode}
        >
          {#key forceRerender}
            <img src={gifSrc} alt={hoveredPerkInfo?.icon_alt} />
          {/key}
        </div>

        {#if mobileMode && landscapeMode}
          <div class="test" class:test_lan={mobileMode && landscapeMode}>
            <div
              class={mobileMode ? 'perk_info_name_mobile' : 'perk_info_name'}
            >
              {hoveredPerkInfo.name}
            </div>
            <div
              class={mobileMode ? 'perk_info_sub_mobile' : 'perk_info_sub'}
              class:perk_info_sub_mobile_lan={mobileMode && landscapeMode}
            >
              {hoveredPerkInfo.character} Addon
            </div>
          </div>
        {:else}
          <div class="perk_info_header">
            <video
              id="bg-vid-addon"
              preload="auto"
              playsinline
              autoplay
              muted
              loop
            >
              <source
                src={mobileMode ? 'smoke_mobile.mp4' : 'videos/smoke.mp4'}
                type="video/mp4"
              />
            </video>
            <div class="perk_info_header_wrapper">
              <div
                class={mobileMode ? 'perk_info_name_mobile' : 'perk_info_name'}
                class:perk_info_name_mobile_lan={mobileMode && landscapeMode}
              >
                {hoveredPerkInfo.name}
              </div>
              <div
                class={mobileMode ? 'perk_info_sub_mobile' : 'perk_info_sub'}
              >
                {hoveredPerkInfo.character} Addon
              </div>
            </div>
          </div>
        {/if}
      </div>
      <div
        class={mobileMode ? 'perk_info_desc_mobile' : 'perk_info_desc'}
        class:perk_info_desc_mobile_lan={mobileMode && landscapeMode}
      >
        <Description description={hoveredPerkInfo.description} />
      </div>
    {/if}
  </div>
{/if}

<style>
  .perk_info_meta_mobile_lan {
    position: static !important;
    flex-direction: column !important;
    width: 100% !important;
  }
  .perk_info_img_lan {
    width: 100% !important;
    align-items: center !important;
    display: flex !important;
    overflow-y: auto !important;
  }
  .perk_info_img_lan img {
    display: block !important;
    margin: 0 auto !important;
  }
  .test_lan {
    padding: 10px 5px !important;
    text-align: center !important;
  }

  .perk_info_sub_mobile_lan {
    font-size: 16px !important;
  }
  .perk_info_name_mobile_lan {
    font-size: 20px !important;
  }

  .perk_info_desc_mobile_lan {
    padding: 14px !important;
    overflow-y: hidden !important;
    margin-bottom: 0px !important;
    margin-top: 0px !important;
    height: auto !important;
  }

  video::-webkit-media-controls {
    display: none !important;
    opacity: 0 !important;
  }
  #bg-vid-addon {
    appearance: none;
    background: black;
  }
  .perk_info_desc :global(img) {
    vertical-align: middle !important;
  }
  .perk_info_desc_mobile :global(img) {
    vertical-align: middle !important;
  }
  .perk_info_header video {
    width: 500px !important;
    height: 104px !important;
    position: absolute;
  }
  .perk_info_hud_mobile {
    height: inherit;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.5);
    background-color: black;
  }
  .perk_info_hud {
    bottom: 25%;
    right: 8%;
    position: absolute;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    max-width: 600px;
    width: 600px;
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.5);
    background-color: black;
  }
  .perk_info_meta {
    display: flex;
    flex-direction: row;
  }
  .perk_info_meta_mobile {
    position: fixed;
    display: flex;
    flex-direction: row;
  }
  .perk_info_img {
    background: #000000 url('../images/img_bg.jpg') left;
  }
  .perk_info_img img {
    transition: opacity 0.2s ease-out;
    cursor: pointer;
    width: 100px;
    height: 100px;
  }

  .perk_info_header_wrapper {
    flex: 1 0;
    font-family: 'Open Sans', sans-serif;
    padding: 0 20px;
    color: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
  }
  .perk_info_header {
    width: 100%;
    display: flex;
  }
  .perk_info_name {
    font-size: 1.7rem;
    font-weight: 600 !important;
  }
  .perk_info_name_mobile {
    font-size: 1.7rem;
    font-weight: 600 !important;
  }
  .perk_info_sub {
    font-size: 1.4rem;
    font-weight: 500 !important;
    color: rgb(255, 255, 255);
  }
  .perk_info_sub_mobile {
    font-size: 1.4rem;
    font-weight: 400 !important;
    color: rgb(255, 255, 255);
  }

  .perk_info_desc {
    background-color: #0b0b0b;
    border: 1px solid #1f1f1f;
    padding: 17px;
    color: #aaa9a9;
    font-size: 16px;
  }
  .perk_info_desc_mobile {
    background-color: #0b0b0b;
    border: 1px solid #1f1f1f;
    padding: 17px;

    color: #aaa9a9;
    font-size: 16px;

    margin-top: 105px;
    overflow-y: auto;
    margin-bottom: 100px;
    height: calc(100% - 210px);
    width: 100%;
  }
</style>
