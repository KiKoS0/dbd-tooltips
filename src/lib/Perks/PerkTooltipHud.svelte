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
  import { visualStore } from '../Stores/VisualStore.svelte'
  import { emptyPerk, generateGifSrc } from '../utils.svelte'
  import { track } from '../Api/inngest'

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
  const vizStore = visualStore()

  let hudElement = $state<HTMLDivElement | undefined>(undefined)

  function handleClickOutside(event: MouseEvent) {
    if (
      vizStore.isHudPinned &&
      hudElement &&
      !hudElement.contains(event.target as Node)
    ) {
      vizStore.unpinHud()
    }
  }

  $effect(() => {
    if (vizStore.isHudPinned) {
      document.addEventListener('click', handleClickOutside)
      return () => {
        document.removeEventListener('click', handleClickOutside)
      }
    }
  })

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

  const getWikiUrl = (link?: string) => {
    if (!link) return undefined
    if (link.startsWith('http://') || link.startsWith('https://')) {
      return link
    }
    return `https://deadbydaylight.wiki.gg/${link}`
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
    generateGifSrc(hoveredPerkInfo?.gif)
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

  $inspect(hoveredPerk)
</script>

{#if !disabled}
  <div
    bind:this={hudElement}
    style={overridePosScale(currentGameState.hudSize)}
    transition:fade
    class={mobileMode ? 'perk_info_hud_mobile' : 'perk_info_hud'}
    role="tooltip"
    onmouseenter={() => {
      // Keep tooltip open when hovering over it
    }}
  >
    {#if vizStore.isHudPinned && !mobileMode}
      <button
        class="close-button"
        onclick={() => vizStore.unpinHud()}
        title="Close tooltip"
        aria-label="Close tooltip"
      >
        ✕
      </button>
    {/if}
    {#if hoveredPerkInfo}
      <div
        class={mobileMode ? 'perk_info_meta_mobile' : 'perk_info_meta'}
        class:perk_info_meta_mobile_lan={mobileMode && landscapeMode}
      >
        {#if hoveredPerkInfo.link}
          <a
            href={getWikiUrl(hoveredPerkInfo.link)}
            target="_blank"
            rel="noopener noreferrer"
            class="perk_info_img"
            class:perk_info_img_lan={mobileMode && landscapeMode}
            onclick={(e) => {
              e.stopPropagation()
              track('click', {
                link: getWikiUrl(hoveredPerkInfo.link),
                type: 'perk_icon'
              })
            }}
          >
            <img src={gifSrc} alt={hoveredPerkInfo.icon_alt} />
          </a>
        {:else}
          <div
            class="perk_info_img"
            class:perk_info_img_lan={mobileMode && landscapeMode}
          >
            <img src={gifSrc} alt={hoveredPerkInfo.icon_alt} />
          </div>
        {/if}

        {#if mobileMode && landscapeMode}
          <div class="test" class:test_lan={mobileMode && landscapeMode}>
            {#if hoveredPerkInfo.link}
              <a
                href={getWikiUrl(hoveredPerkInfo.link)}
                target="_blank"
                rel="noopener noreferrer"
                class={mobileMode ? 'perk_info_name_mobile' : 'perk_info_name'}
                onclick={(e) => {
                  e.stopPropagation()
                  track('click', {
                    link: getWikiUrl(hoveredPerkInfo.link),
                    type: 'perk_title'
                  })
                }}
              >
                {hoveredPerkInfo['name']}
              </a>
            {:else}
              <div
                class={mobileMode ? 'perk_info_name_mobile' : 'perk_info_name'}
              >
                {hoveredPerkInfo['name']}
              </div>
            {/if}
            <div
              class={mobileMode ? 'perk_info_sub_mobile' : 'perk_info_sub'}
              class:perk_info_sub_mobile_lan={mobileMode && landscapeMode}
            >
              {#if hoveredPerkInfo.character_link}
                <a
                  href={getWikiUrl(hoveredPerkInfo.character_link)}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="character-link"
                  onclick={(e) => {
                    e.stopPropagation()
                    track('click', {
                      link: getWikiUrl(hoveredPerkInfo.character_link),
                      type: 'character'
                    })
                  }}
                >
                  {perkOrGeneral(hoveredPerkInfo.character)} PERK
                </a>
              {:else}
                {perkOrGeneral(hoveredPerkInfo.character)} PERK
              {/if}
            </div>
          </div>
        {:else}
          <div class="perk_info_header">
            <div class="perk_info_header_wrapper">
              {#if hoveredPerkInfo.link}
                <a
                  href={getWikiUrl(hoveredPerkInfo.link)}
                  target="_blank"
                  rel="noopener noreferrer"
                  class={mobileMode
                    ? 'perk_info_name_mobile'
                    : 'perk_info_name'}
                  class:perk_info_name_mobile_lan={mobileMode && landscapeMode}
                  onclick={(e) => {
                    e.stopPropagation()
                    track('click', {
                      link: getWikiUrl(hoveredPerkInfo.link),
                      type: 'perk_title'
                    })
                  }}
                >
                  {hoveredPerkInfo['name']}
                </a>
              {:else}
                <div
                  class={mobileMode
                    ? 'perk_info_name_mobile'
                    : 'perk_info_name'}
                  class:perk_info_name_mobile_lan={mobileMode && landscapeMode}
                >
                  {hoveredPerkInfo['name']}
                </div>
              {/if}
              <div
                class={mobileMode ? 'perk_info_sub_mobile' : 'perk_info_sub'}
              >
                {#if hoveredPerkInfo.character_link}
                  <a
                    href={getWikiUrl(hoveredPerkInfo.character_link)}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="character-link"
                    onclick={(e) => {
                      e.stopPropagation()
                      track('click', {
                        link: getWikiUrl(hoveredPerkInfo.character_link),
                        type: 'character'
                      })
                    }}
                  >
                    {t('perk.tooltip.subtitle', {
                      actor: perkOrGeneral(hoveredPerkInfo.character)
                    })}
                  </a>
                {:else}
                  {t('perk.tooltip.subtitle', {
                    actor: perkOrGeneral(hoveredPerkInfo.character)
                  })}
                {/if}
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
  /* Keyframe animations */
  @keyframes breatheGlow {
    0%,
    100% {
      background: radial-gradient(
        ellipse at 50% 50%,
        rgba(99, 46, 115, 0.35) 0%,
        rgba(99, 46, 115, 0.175) 40%,
        transparent 70%
      );
      opacity: 0.5;
    }
    16% {
      opacity: 1;
    }
    33% {
      background: radial-gradient(
        ellipse at 50% 50%,
        rgba(30, 111, 35, 0.35) 0%,
        rgba(30, 111, 35, 0.175) 40%,
        transparent 70%
      );
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
    66% {
      background: radial-gradient(
        ellipse at 50% 50%,
        rgba(47, 83, 132, 0.35) 0%,
        rgba(47, 83, 132, 0.175) 40%,
        transparent 70%
      );
      opacity: 1;
    }
    83% {
      opacity: 0.5;
    }
  }

  @keyframes breatheShadow {
    0%,
    100% {
      background-image:
        linear-gradient(
          180deg,
          rgba(99, 46, 115, 0.14) 0%,
          rgba(99, 46, 115, 0.07) 50%,
          transparent 100%
        ),
        repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(255, 255, 255, 0.03) 2px,
          rgba(255, 255, 255, 0.03) 4px
        );
    }
    33% {
      background-image:
        linear-gradient(
          180deg,
          rgba(30, 111, 35, 0.14) 0%,
          rgba(30, 111, 35, 0.07) 50%,
          transparent 100%
        ),
        repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(255, 255, 255, 0.03) 2px,
          rgba(255, 255, 255, 0.03) 4px
        );
    }
    66% {
      background-image:
        linear-gradient(
          180deg,
          rgba(47, 83, 132, 0.14) 0%,
          rgba(47, 83, 132, 0.07) 50%,
          transparent 100%
        ),
        repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(255, 255, 255, 0.03) 2px,
          rgba(255, 255, 255, 0.03) 4px
        );
    }
  }

  /* Mobile landscape mode overrides */
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

  /* Image vertical alignment */
  .perk_info_desc :global(img),
  .perk_info_desc_mobile :global(img) {
    vertical-align: middle !important;
  }

  /* Main containers */
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
    max-width: 600px;
    width: 600px;
    border-radius: 12px;
    overflow: visible;
    box-shadow: 0px 8px 32px rgba(0, 0, 0, 0.6);
    background: linear-gradient(145deg, #1a1a1a 0%, #0f0f0f 100%);
    border: 2px solid #1a1a1a;
    backdrop-filter: blur(10px);
    pointer-events: auto;
  }
  /* Header sections with breathing animation */
  .perk_info_meta,
  .perk_info_meta_mobile {
    display: flex;
    flex-direction: row;
    position: relative;
    overflow: hidden;
    border-radius: 12px 12px 0 0;
  }
  .perk_info_meta_mobile {
    width: 100%;
  }

  /* Breathing animation base layer */
  .perk_info_meta::before,
  .perk_info_meta_mobile::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      #1a1a1a 0%,
      #2a2a2a 25%,
      #1a1a1a 50%,
      #2a2a2a 75%,
      #1a1a1a 100%
    );
    z-index: 0;
  }

  /* Breathing animation glow layer */
  .perk_info_meta::after,
  .perk_info_meta_mobile::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      ellipse at 50% 50%,
      rgba(99, 46, 115, 0.35) 0%,
      rgba(99, 46, 115, 0.175) 40%,
      transparent 70%
    );
    animation: breatheGlow 30s ease-in-out infinite;
    z-index: 1;
  }

  .perk_info_meta > *,
  .perk_info_meta_mobile > * {
    position: relative;
    z-index: 2;
  }
  .perk_info_img {
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .perk_info_meta_mobile .perk_info_img {
    transform: translateX(-16px);
  }
  a.perk_info_img {
    cursor: pointer;
    transition: opacity 0.2s ease;
  }
  a.perk_info_img:hover {
    opacity: 0.8;
  }
  .perk_info_img img {
    width: 120px;
    height: 120px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  }

  .perk_info_header_wrapper {
    flex: 1 0;
    font-family: 'Open Sans', sans-serif;
    padding: 20px 24px;
    color: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    position: relative;
    z-index: 1;
  }
  .perk_info_header {
    width: 100%;
    display: flex;
    position: relative;
    overflow: hidden;
  }
  .perk_info_name {
    font-size: 2rem;
    font-weight: 600 !important;
  }
  .perk_info_name_mobile {
    font-size: 1.7rem;
    font-weight: 600 !important;
  }
  a.perk_info_name,
  a.perk_info_name_mobile {
    color: inherit;
    text-decoration: none;
    transition: color 0.2s ease;
  }
  a.perk_info_name:hover,
  a.perk_info_name_mobile:hover {
    color: #e7cda2;
  }
  .perk_info_sub {
    font-size: 1.25rem;
    font-weight: 500 !important;
    color: rgb(255, 255, 255);
  }
  .perk_info_sub_mobile {
    font-size: 16px;
    font-weight: 400 !important;
    color: rgb(255, 255, 255);
  }
  .character-link {
    color: inherit;
    text-decoration: none;
    transition: color 0.2s ease;
  }
  .character-link:hover {
    color: #e7cda2;
  }

  /* Description sections with breathing shadow */
  .perk_info_desc,
  .perk_info_desc_mobile {
    position: relative;
    background-color: #2a2a35;
    color: #c0c0c0;
    overflow: hidden;
  }

  .perk_info_desc {
    padding: 20px;
    font-size: 15px;
    line-height: 1.4;
  }

  .perk_info_desc_mobile {
    border: 1px solid #1f1f1f;
    border-top: none;
    padding: 17px;
    font-size: 16px;
    overflow-y: scroll;
    width: 100%;
    flex: 1;
    margin-top: 0;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
  }
  .perk_info_desc_mobile::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }

  /* Breathing shadow gradient */
  .perk_info_desc::before,
  .perk_info_desc_mobile::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 20%;
    background-image:
      linear-gradient(
        180deg,
        rgba(99, 46, 115, 0.14) 0%,
        rgba(99, 46, 115, 0.07) 50%,
        transparent 100%
      ),
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(255, 255, 255, 0.03) 2px,
        rgba(255, 255, 255, 0.03) 4px
      );
    animation: breatheShadow 30s ease-in-out infinite;
    pointer-events: none;
    z-index: 0;
  }

  .perk_info_desc > :global(*),
  .perk_info_desc_mobile > :global(*) {
    position: relative;
    z-index: 1;
  }

  .perk_info_desc :global(a),
  .perk_info_desc_mobile :global(a) {
    color: #777777;
    text-decoration: none;
  }

  .close-button {
    position: absolute;
    top: -16px;
    right: -16px;
    width: 32px;
    height: 32px;
    border: 2px solid #2a2a2a;
    background-color: #1a1520;
    color: #e7cda2;
    font-size: 18px;
    font-weight: bold;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition:
      background-color 0.2s ease,
      border-color 0.2s ease,
      color 0.2s ease;
    z-index: 10;
    padding: 0;
    line-height: 1;
    user-select: none;
  }

  .close-button:hover {
    background-color: #252030;
    border-color: #3a3a3a;
    color: #f0d9b0;
  }
</style>
