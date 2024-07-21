<script lang="ts">
  import { fade } from 'svelte/transition'
  import { t } from '../I18n'
  import Description from '../shared/Description.svelte'
  import type { Nullable } from '../types'
  import type {
    LocalizedPerkEntries,
    Perk,
    PerkEntries,
    PerkEntry
  } from '../Stores/types'
  import type { DbdUIScale } from '../Twitch/types'
  import { mainGameStore } from '../Stores/MainGameStore'
  import { localizationStore } from '../Stores/LocalizationStore.svelte'
  import { currentGameStateStore } from '../Stores/CurrentGameStateStore.svelte'
  import { emptyPerk, removeDataPrefixInPath } from '../utils.svelte'

  const cdnHost = import.meta.env?.VITE_CDN_HOST

  let {
    disabled = false,
    hoveredPerk = null,
    mobileMode = false,
    landscapeMode = false
  } = $props<{
    disabled?: boolean
    hoveredPerk?: Nullable<Perk>
    mobileMode?: boolean
    landscapeMode?: boolean
  }>()

  const gameStore = mainGameStore()
  const localization = localizationStore()
  const currentGameState = currentGameStateStore()

  const localizePerk = (
    perkId: string,
    enDic: PerkEntries,
    localizedDic?: LocalizedPerkEntries
  ) => {
    const hoveredPerk = Object.assign({}, enDic[perkId])
    let toUpdate = {}
    if (localizedDic && localizedDic[perkId]) {
      // It wouldn't override them for english so we can use the english as a fallback.
      toUpdate = {
        description: localizedDic[perkId].desc || hoveredPerk.description,
        name: localizedDic[perkId].name || hoveredPerk.name
      }
    }
    return { ...hoveredPerk, ...toUpdate } as PerkEntry
  }

  const hoveredPerkInfo: Partial<PerkEntry> | undefined = $derived.by(() => {
    if (!hoveredPerk || !gameStore.survivorsData || !gameStore.killersData) {
      return undefined
    }

    const perkDic =
      hoveredPerk.actor === 'survivor'
        ? gameStore.survivorsData
        : gameStore.killersData
    const localizedPerkDic =
      hoveredPerk.actor === 'survivor'
        ? localization.survivorsLocalizationData
        : localization.killersLocalizationData

    const perkId = hoveredPerk.id

    return perkDic[perkId]
      ? localizePerk(perkId, perkDic, localizedPerkDic)
      : emptyPerk()
  })

  let gifSrc: string | undefined = $derived(
    hoveredPerkInfo?.gif &&
      `https://${cdnHost}/${removeDataPrefixInPath(hoveredPerkInfo?.gif)}`
  )

  function perkOrGeneral(value?: string) {
    var res = value && value.toUpperCase()
    if (res == 'ALL') {
      return t('general')
    } else if (res) {
      return res
    }
    return ''
  }

  const scaleToPositions = {
    '70': [21, 7],
    '75': [22, 8],
    '80': [25, 8],
    '85': [25, 9],
    '90': [27, 9],
    '95': [28, 10],
    '100': [29, 10]
  }
  function overridePosScale(hudSize: DbdUIScale) {
    if (!mobileMode && hudSize) {
      return `bottom: ${scaleToPositions[hudSize][0]}% !important; right: ${scaleToPositions[hudSize][1]}% !important;`
    } else return ''
  }
</script>

{#if !disabled}
  <div
    style={overridePosScale(currentGameState.hudSize)}
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
          <img src={gifSrc} alt={hoveredPerkInfo.icon_alt} />
        </div>

        {#if mobileMode && landscapeMode}
          <div class="test" class:test_lan={mobileMode && landscapeMode}>
            <div
              class={mobileMode ? 'perk_info_name_mobile' : 'perk_info_name'}
            >
              {hoveredPerkInfo['name']}
            </div>
            <div
              class={mobileMode ? 'perk_info_sub_mobile' : 'perk_info_sub'}
              class:perk_info_sub_mobile_lan={mobileMode && landscapeMode}
            >
              {perkOrGeneral(hoveredPerkInfo.character)} PERK
            </div>
          </div>
        {:else}
          <div class="perk_info_header">
            <video
              id="bg-vid-perk"
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
                {hoveredPerkInfo['name']}
              </div>
              <div
                class={mobileMode ? 'perk_info_sub_mobile' : 'perk_info_sub'}
              >
                {t('perk.tooltip.subtitle', {
                  actor: perkOrGeneral(hoveredPerkInfo.character)
                })}
              </div>
            </div>
          </div>
        {/if}
      </div>
      <div
        class={mobileMode ? 'perk_info_desc_mobile' : 'perk_info_desc'}
        class:perk_info_desc_mobile_lan={mobileMode && landscapeMode}
      >
        <Description
          description={hoveredPerkInfo.description}
          changelogs={hoveredPerkInfo.changelogs}
          {mobileMode}
        />
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
  #bg-vid-perk {
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
    /* background-color: rgba(241, 208, 18, 0.897); */
    /* width: 25%;
    height: 25%; */
    /* width: 600px; */
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
    /* background-color: rgba(221, 18, 18, 0.897); */
  }
  .perk_info_meta_mobile {
    position: fixed;
    display: flex;
    flex-direction: row;
  }
  .perk_info_img {
    /* background-color: rgba(52, 18, 241, 0.897); */
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
    font-size: 1.1rem;
    font-weight: 500 !important;
    color: rgb(255, 255, 255);
  }
  .perk_info_sub_mobile {
    font-size: 16px;
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
