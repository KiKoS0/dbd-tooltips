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
  import { emptyPerk, generateGifSrc } from '../utils.svelte'

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
    style={overridePosScale(currentGameState.hudSize)}
    transition:fade
    class={mobileMode ? 'perk_info_hud_mobile' : 'perk_info_hud'}
    role="tooltip"
    onmouseenter={() => {
      // Keep tooltip open when hovering over it
    }}
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

  .perk_info_desc :global(img) {
    vertical-align: middle !important;
  }
  .perk_info_desc_mobile :global(img) {
    vertical-align: middle !important;
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
    max-width: 600px;
    width: 600px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0px 8px 32px rgba(0, 0, 0, 0.6);
    background: linear-gradient(145deg, #1a1a1a 0%, #0f0f0f 100%);
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    pointer-events: auto;
  }
  .perk_info_meta {
    display: flex;
    flex-direction: row;
    position: relative;
    overflow: hidden;
  }
  .perk_info_meta::before {
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
  .perk_info_meta::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(60, 30, 120, 0.3) 0%,
      rgba(100, 60, 180, 0.35) 25%,
      rgba(140, 90, 220, 0.45) 50%,
      rgba(100, 60, 180, 0.35) 75%,
      rgba(60, 30, 120, 0.3) 100%
    );
    background-size: 300% 300%;
    animation: breathe 24s ease-in-out infinite;
    z-index: 1;
  }
  .perk_info_meta > * {
    position: relative;
    z-index: 2;
  }

      background: linear-gradient(135deg,
        rgba(60, 30, 120, 0.3) 0%,
        rgba(100, 60, 180, 0.35) 25%,
        rgba(140, 90, 220, 0.45) 50%,
        rgba(100, 60, 180, 0.35) 75%,
        rgba(60, 30, 120, 0.3) 100%
      );
      background-size: 300% 300%;
      background-position: 0% 50%;
      opacity: 0.5;
    }
    8% {
      background-position: 50% 70%;
      opacity: 0.8;
    }
    16% {
      background-position: 100% 30%;
      opacity: 1;
    }
    25% {
      background: linear-gradient(135deg,
        rgba(60, 30, 120, 0.3) 0%,
        rgba(100, 60, 180, 0.35) 25%,
        rgba(140, 90, 220, 0.45) 50%,
        rgba(100, 60, 180, 0.35) 75%,
        rgba(60, 30, 120, 0.3) 100%
      );
      background-size: 300% 300%;
  @keyframes breathe {
    0% {
      background-position: 0% 50%;
      opacity: 0.5;
      background: linear-gradient(135deg,
        rgba(60, 120, 80, 0.3) 0%,
        rgba(80, 160, 100, 0.35) 25%,
        rgba(100, 200, 120, 0.45) 50%,
        rgba(80, 160, 100, 0.35) 75%,
        rgba(60, 120, 80, 0.3) 100%
      );
      background-size: 300% 300%;
      background-position: 0% 50%;
      opacity: 0.5;
    }
    41% {
    }
    33% {
      background-position: 50% 70%;
    49% {
      background-position: 100% 30%;
      opacity: 1;
    }
    58% {
      background: linear-gradient(135deg,
        rgba(60, 120, 80, 0.3) 0%,
        rgba(80, 160, 100, 0.35) 25%,
        rgba(100, 200, 120, 0.45) 50%,
        rgba(80, 160, 100, 0.35) 75%,
        rgba(60, 120, 80, 0.3) 100%
      );
      background-size: 300% 300%;
      background-position: 0% 50%;
      opacity: 0.5;
    }
      opacity: 0.8;
      background: linear-gradient(135deg,
        rgba(30, 60, 120, 0.3) 0%,
        rgba(60, 100, 180, 0.35) 25%,
        rgba(90, 140, 220, 0.45) 50%,
        rgba(60, 100, 180, 0.35) 75%,
        rgba(30, 60, 120, 0.3) 100%
      );
      background-size: 300% 300%;
      background-position: 0% 50%;
      opacity: 0.5;
    }
    74% {
      background-position: 50% 70%;
      opacity: 0.8;
    }
    82% {
    }
    66% {
      background-position: 100% 30%;
    91% {
      background: linear-gradient(135deg,
        rgba(30, 60, 120, 0.3) 0%,
        rgba(60, 100, 180, 0.35) 25%,
        rgba(90, 140, 220, 0.45) 50%,
        rgba(60, 100, 180, 0.35) 75%,
        rgba(30, 60, 120, 0.3) 100%
      );
      background-size: 300% 300%;
      background-position: 0% 50%;
      opacity: 0.5;
    }
      opacity: 1;
      background: linear-gradient(135deg,
        rgba(60, 30, 120, 0.3) 0%,
        rgba(100, 60, 180, 0.35) 25%,
        rgba(140, 90, 220, 0.45) 50%,
        rgba(100, 60, 180, 0.35) 75%,
        rgba(60, 30, 120, 0.3) 100%
      );
      background-size: 300% 300%;
    }
    100% {
      background-position: 0% 50%;
      opacity: 0.5;
    }
  }
  .perk_info_meta_mobile {
    position: fixed;
    display: flex;
    flex-direction: row;
  }
  .perk_info_img {
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .perk_info_img img {
    transition: all 0.3s ease;
    cursor: pointer;
    width: 100px;
    height: 100px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  }
  .perk_info_img img:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.6);
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

  .perk_info_desc {
    position: relative;
    background-color: #1a1520;
    padding: 20px;
    color: #c0c0c0;
    font-size: 15px;
    line-height: 1.4;
    overflow: hidden;
  }
  .perk_info_desc::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 80px;
    background-image:
      linear-gradient(180deg, rgba(120, 80, 200, 0.15) 0%, transparent 100%),
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(255, 255, 255, 0.03) 2px,
        rgba(255, 255, 255, 0.03) 4px
      );
    pointer-events: none;
    animation: descShadow 24s ease-in-out infinite;
    z-index: 0;
  }
  .perk_info_desc > * {
    position: relative;
    z-index: 1;
  }
  .perk_info_desc_mobile {

  @keyframes descShadow {
    0% {
      background-image:
        linear-gradient(180deg,
          rgba(140, 90, 220, 0.2) 0%,
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
    8% {
      background-image:
        linear-gradient(180deg,
          rgba(140, 90, 220, 0.25) 0%,
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
    16% {
      background-image:
        linear-gradient(180deg,
          rgba(140, 90, 220, 0.3) 0%,
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
    25% {
      background-image:
        linear-gradient(180deg,
          rgba(140, 90, 220, 0.2) 0%,
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
        linear-gradient(180deg,
          rgba(100, 200, 120, 0.2) 0%,
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
    41% {
      background-image:
        linear-gradient(180deg,
          rgba(100, 200, 120, 0.25) 0%,
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
    49% {
      background-image:
        linear-gradient(180deg,
          rgba(100, 200, 120, 0.3) 0%,
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
    58% {
      background-image:
        linear-gradient(180deg,
          rgba(100, 200, 120, 0.2) 0%,
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
        linear-gradient(180deg,
          rgba(90, 140, 220, 0.2) 0%,
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
    74% {
      background-image:
        linear-gradient(180deg,
          rgba(90, 140, 220, 0.25) 0%,
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
    82% {
      background-image:
        linear-gradient(180deg,
          rgba(90, 140, 220, 0.3) 0%,
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
    91% {
      background-image:
        linear-gradient(180deg,
          rgba(90, 140, 220, 0.2) 0%,
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
    100% {
      background-image:
        linear-gradient(180deg,
          rgba(140, 90, 220, 0.2) 0%,
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
