<script lang="ts">
  import { fade } from 'svelte/transition'

  import Description from '../shared/Description.svelte'
  import type { Addon, AddonEntry } from '../Stores/types'
  import type { DbdUIScale } from '../Twitch/types'
  import type { Nullable } from '../types'
  import { mainGameStore } from '../Stores/MainGameStore'
  import { currentGameStateStore } from '../Stores/CurrentGameStateStore.svelte'
  import { emptyAddon, generateGifSrc } from '../utils.svelte'

  const gameStore = mainGameStore()
  const currentGameState = currentGameStateStore()

  let {
    disabled = false,
    hoveredAddon = null,
    mobileMode = false,
    landscapeMode = false
  } = $props<{
    disabled?: boolean
    hoveredAddon?: Nullable<Addon>
    mobileMode?: boolean
    landscapeMode?: boolean
  }>()

  let hoveredAddonInfo:
    | (Partial<AddonEntry> & {
        character?: string
        gif?: string
        icon_alt?: string
      })
    | undefined = $derived.by(() => {
    if (!hoveredAddon || !gameStore.killersMetadata) {
      return undefined
    }
    const killerMetadataDic = gameStore.killersMetadata
    return killerMetadataDic[hoveredAddon.killerId]
      ? {
          character: killerMetadataDic[hoveredAddon.killerId].name,
          ...killerMetadataDic[hoveredAddon.killerId].addons[hoveredAddon.id]
        }
      : emptyAddon()
  })

  let gifSrc: string | undefined = $derived(
    generateGifSrc(hoveredAddonInfo?.img_path)
  )

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
</script>

{#if !disabled}
  <div
    style={overridePosScale(currentGameState.hudSize)}
    transition:fade
    class={mobileMode ? 'perk_info_hud_mobile' : 'perk_info_hud'}
  >
    {#if hoveredAddonInfo}
      <div
        class={mobileMode ? 'perk_info_meta_mobile' : 'perk_info_meta'}
        class:perk_info_meta_mobile_lan={mobileMode && landscapeMode}
      >
        <div
          class="perk_info_img"
          class:perk_info_img_lan={mobileMode && landscapeMode}
        >
          <img src={gifSrc} alt={hoveredAddonInfo?.icon_alt} />
        </div>

        {#if mobileMode && landscapeMode}
          <div class="test" class:test_lan={mobileMode && landscapeMode}>
            <div
              class={mobileMode ? 'perk_info_name_mobile' : 'perk_info_name'}
            >
              {hoveredAddonInfo.name}
            </div>
            <div
              class={mobileMode ? 'perk_info_sub_mobile' : 'perk_info_sub'}
              class:perk_info_sub_mobile_lan={mobileMode && landscapeMode}
            >
              {hoveredAddonInfo.character} Addon
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
                {hoveredAddonInfo.name}
              </div>
              <div
                class={mobileMode ? 'perk_info_sub_mobile' : 'perk_info_sub'}
              >
                {hoveredAddonInfo.character} Addon
              </div>
            </div>
          </div>
        {/if}
      </div>
      <div
        class={mobileMode ? 'perk_info_desc_mobile' : 'perk_info_desc'}
        class:perk_info_desc_mobile_lan={mobileMode && landscapeMode}
      >
        <Description description={hoveredAddonInfo.description} />
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
