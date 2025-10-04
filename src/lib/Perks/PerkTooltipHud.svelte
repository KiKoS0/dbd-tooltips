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

  // Color breathing animation state
  const colors = [
    { r: 99, g: 46, b: 115 }, // Purple #632E73
    { r: 30, g: 111, b: 35 }, // Green #1E6F23
    { r: 47, g: 83, b: 132 } // Blue #2F5384
  ]

  let colorIndex = $state(0)
  let breathProgress = $state(0)
  let breathDirection = $state(1)
  let chaosOffset = $state(0)

  function lerp(a: number, b: number, t: number) {
    return a + (b - a) * t
  }

  function getCurrentColor() {
    const currentColor = colors[colorIndex]
    const nextColor = colors[(colorIndex + 1) % colors.length]
    const transitionPhase = Math.max(0, (breathProgress - 0.7) / 0.3)

    const r = lerp(currentColor.r, nextColor.r, transitionPhase)
    const g = lerp(currentColor.g, nextColor.g, transitionPhase)
    const b = lerp(currentColor.b, nextColor.b, transitionPhase)

    // Breathing opacity: oscillate between 0.2 and 0.5 with sine easing
    const breathEase = Math.sin(breathProgress * Math.PI)
    const opacity = 0.2 + breathEase * 0.3

    // Add some chaos to the movement with secondary waves
    const chaosX = Math.sin(chaosOffset * 2.3) * 15
    const chaosY = Math.cos(chaosOffset * 1.7) * 10

    // Moving gradient position - left to right with chaos
    const xPos = 20 + breathEase * 60 + chaosX // moves from 20% to 80% with variation
    const yPos = 50 + chaosY // oscillates around center

    return { r, g, b, opacity, xPos, yPos }
  }

  const animatedColor = $derived(getCurrentColor())
  const headerStyle = $derived(`
    --breath-r: ${animatedColor.r};
    --breath-g: ${animatedColor.g};
    --breath-b: ${animatedColor.b};
    --breath-opacity: ${animatedColor.opacity};
    --breath-x: ${animatedColor.xPos}%;
    --breath-y: ${animatedColor.yPos}%;
  `)

  $effect(() => {
    let animationFrame: number
    let lastTime = performance.now()

    function animate(currentTime: number) {
      const delta = (currentTime - lastTime) / 1000
      lastTime = currentTime

      // Faster breathing: 0.3 = ~3.3 seconds per breath cycle
      breathProgress += delta * 0.3 * breathDirection

      // Update chaos offset at different speed
      chaosOffset += delta * 0.8

      if (breathProgress >= 1) {
        breathProgress = 1
        breathDirection = -1
      } else if (breathProgress <= 0) {
        breathProgress = 0
        breathDirection = 1
        colorIndex = (colorIndex + 1) % colors.length
      }

      animationFrame = requestAnimationFrame(animate)
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationFrame)
    }
  })

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
        style={headerStyle}
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
        style={headerStyle}
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
    background: radial-gradient(
      ellipse at var(--breath-x) var(--breath-y),
      rgba(
          var(--breath-r),
          var(--breath-g),
          var(--breath-b),
          var(--breath-opacity)
        )
        0%,
      rgba(
          var(--breath-r),
          var(--breath-g),
          var(--breath-b),
          calc(var(--breath-opacity) * 0.5)
        )
        40%,
      transparent 70%
    );
    transition: background 0.1s linear;
    z-index: 1;
  }
  .perk_info_meta > * {
    position: relative;
    z-index: 2;
  }
  .perk_info_meta_mobile {
    display: flex;
    flex-direction: row;
    position: relative;
    overflow: hidden;
    width: 100%;
  }
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
  .perk_info_meta_mobile::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      ellipse at var(--breath-x) var(--breath-y),
      rgba(
          var(--breath-r),
          var(--breath-g),
          var(--breath-b),
          var(--breath-opacity)
        )
        0%,
      rgba(
          var(--breath-r),
          var(--breath-g),
          var(--breath-b),
          calc(var(--breath-opacity) * 0.5)
        )
        40%,
      transparent 70%
    );
    transition: background 0.1s linear;
    z-index: 1;
  }
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
    height: 20%;
    background-image:
      linear-gradient(
        180deg,
        rgba(
            var(--breath-r),
            var(--breath-g),
            var(--breath-b),
            calc(var(--breath-opacity) * 0.4)
          )
          0%,
        rgba(
            var(--breath-r),
            var(--breath-g),
            var(--breath-b),
            calc(var(--breath-opacity) * 0.2)
          )
          50%,
        transparent 100%
      ),
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(255, 255, 255, 0.03) 2px,
        rgba(255, 255, 255, 0.03) 4px
      );
    transition: background-image 0.1s linear;
    pointer-events: none;
    z-index: 0;
  }
  .perk_info_desc > * {
    position: relative;
    z-index: 1;
  }

  .perk_info_desc_mobile {
    position: relative;
    background-color: #1a1520;
    border: 1px solid #1f1f1f;
    padding: 17px;
    color: #aaa9a9;
    font-size: 16px;
    overflow-y: auto;
    width: 100%;
    flex: 1;
  }
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
        rgba(
            var(--breath-r),
            var(--breath-g),
            var(--breath-b),
            calc(var(--breath-opacity) * 0.4)
          )
          0%,
        rgba(
            var(--breath-r),
            var(--breath-g),
            var(--breath-b),
            calc(var(--breath-opacity) * 0.2)
          )
          50%,
        transparent 100%
      ),
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(255, 255, 255, 0.03) 2px,
        rgba(255, 255, 255, 0.03) 4px
      );
    transition: background-image 0.1s linear;
    pointer-events: none;
    z-index: 0;
  }
  .perk_info_desc_mobile > * {
    position: relative;
    z-index: 1;
  }
</style>
