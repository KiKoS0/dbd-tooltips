<script lang="ts">
  import MobilePerk from './MobilePerk.svelte'
  import { onMount } from 'svelte'
  import PerkTootipHud from './PerkTooltipHud.svelte'

  import { fade, fly } from 'svelte/transition'
  import type { Perk, PerkShowControl } from '../Stores/types'
  import type { Nullable } from '../types'
  import { t } from '../I18n'
  import { appStateStore } from '../Stores/AppStateStore.svelte'
  import { visualStore } from '../Stores/VisualStore.svelte'
  import { currentGameStateStore } from '../Stores/CurrentGameStateStore.svelte'
  import { track } from '../Api/inngest'

  onMount(() => {
    // Yeah, this event kicks whenever it wants it can't be trusted to actually work.
    // Sometimes it does and sometimes it doesn't especially
    // when the orientation is changed by clicking the orientation button
    // landscapeMode = window.matchMedia("(orientation: landscape)").matches;
    // window.addEventListener("orientationchange", function () {
    //   landscapeMode = window.matchMedia("(orientation: landscape)").matches;
    // });
  })

  const currentGameState = currentGameStateStore()

  let landscapeMode = true
  let perkHudScale = 0.4

  let visualState = visualStore()

  let hoveredPerk: Nullable<Perk> = $derived(
    currentGameState.perks[visualState.hoveredPerk] || null
  )

  let showPerkLock = $state(false)
  let containerRef: HTMLDivElement | null = $state(null)

  const goBack = () => {
    visualState.clearHoveredAddon()
    visualState.clearHoveredPerk()
  }

  const handleResize = (height: number) => {
    perkHudScale = (height / 534) * 0.4
    console.log(`perkHudScale: ${perkHudScale}`)
  }

  const cssFixes: { [k: string]: string } = {
    perk_info_img: 'overflow-y: scroll;',
    close: 'width: 30px;height: 30px;'
  }

  const fixSmallWidthStuff = (key: string) => {
    if (landscapeMode) return cssFixes[key] || ''
    return ''
  }

  let waitingForData = $derived(currentGameState.perks.every((x) => x === null))

  const perkHudStyle = $derived(
    `transform: translate(-50%, -50%) rotate(45deg) scale(${perkHudScale});`
  )

  const currentlyShowingAddon = $derived(visualState.hoveredAddon !== -1)
  const currentlyShowingPerk = $derived(visualState.hoveredPerk !== -1)
  const perkScreenOpen = $derived(currentlyShowingPerk || currentlyShowingAddon)

  const resizeObserver = new ResizeObserver((entries) =>
    handleResize(entries?.[0]?.contentRect?.height || 540)
  )

  $effect(() => {
    if (!perkScreenOpen) {
      showPerkLock = false
    } else if (!showPerkLock) {
      showPerkLock = true
    }
  })

  $effect(() => {
    if (containerRef) {
      resizeObserver.observe(containerRef)
    }

    return () => resizeObserver.disconnect()
  })

  const perksNumbers: PerkShowControl[] = [0, 1, 3, 2]
</script>

{#if (waitingForData && !showPerkLock) || !appStateStore().enabled}
  <div transition:fade class="status_info">
    <div class="status_info_logo"></div>
  </div>
{:else}
  <div
    class="perk_info_img"
    bind:this={containerRef}
    style={landscapeMode ? fixSmallWidthStuff('perk_info_img') : ''}
  >
    {#if !perkScreenOpen}
      <div in:fly={{ y: -50, duration: 500 }} class="main_screen_header">
        {t('loadout')}
      </div>
      <div class="mobile_perk_hud" style={perkHudStyle}>
        {#each currentGameState.perks as _, i}
          <MobilePerk number={perksNumbers[i]} />
        {/each}
      </div>
      <a
        href="https://ko-fi.com/kikos"
        target="_blank"
        rel="noopener noreferrer"
        onclick={() =>
          track('click', {
            link: 'https://ko-fi.com/kikos',
            platform: 'mobile'
          })}
      >
        <div in:fly={{ x: 50, duration: 500 }} class="support-us">
          <img src="./images/heart-regular-full.svg" alt={t('support.alt')} />
        </div>
      </a>
    {:else}
      <div id="btn-wrapper">
        <span
          onclick={goBack}
          onkeyup={goBack}
          class="close"
          style={landscapeMode ? fixSmallWidthStuff('close') : ''}
          role="button"
          tabindex="0"
          aria-label="Close"
        >
        </span>
      </div>
    {/if}
    <PerkTootipHud
      mobileMode={true}
      disabled={!currentlyShowingPerk}
      {landscapeMode}
      {hoveredPerk}
    />
  </div>
{/if}

<style>
  .support-us {
    position: fixed;
    bottom: 2%;
    right: 2%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background: linear-gradient(145deg, #2a2a35 0%, #1a1a25 100%);
    border: 2px solid #e7cda2;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .support-us:hover {
    background: linear-gradient(145deg, #3a3a45 0%, #2a2a35 100%);
    border-color: #f0d9b0;
    transform: scale(1.05);
  }
  .support-us img {
    width: 24px;
    height: 24px;
    filter: brightness(0) saturate(100%) invert(83%) sepia(14%) saturate(1064%)
      hue-rotate(358deg) brightness(96%) contrast(85%);
    transition: filter 0.2s ease;
  }
  .support-us:hover img {
    filter: brightness(0) saturate(100%) invert(92%) sepia(8%) saturate(1133%)
      hue-rotate(334deg) brightness(101%) contrast(87%);
  }
  .main_screen_header {
    text-align: center;
    font-size: 28px;
    font-family: 'Open Sans', sans-serif;
    font-weight: 600;
    margin-top: 20px;
    margin-bottom: 10px;
    color: #e7cda2;
    text-transform: uppercase;
    letter-spacing: 2px;
  }
  #btn-wrapper {
    display: flex;
    position: sticky;
    top: 0;
    justify-content: center;
    align-items: center;
    z-index: 10;
    background: linear-gradient(180deg, #1a1a25 0%, #2a2a35 100%);
    padding: 10px 0;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
  .mobile_perk_hud {
    width: 572px;
    height: auto;
    flex-wrap: wrap;
    display: flex;
    gap: 60px 60px;
    position: absolute;
    top: 50%;
    left: 53%;
    transform: translate(-50%, -50%) rotate(45deg);
  }
  .perk_info_img {
    background:
      radial-gradient(
        ellipse at 50% 30%,
        rgba(99, 46, 115, 0.15) 0%,
        transparent 50%
      ),
      linear-gradient(180deg, #1a1a25 0%, #2a2a35 50%, #1a1a25 100%);
    color: white;
    height: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
  }
  .perk_info_img::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
  .status_info {
    background:
      radial-gradient(
        ellipse at 50% 30%,
        rgba(99, 46, 115, 0.15) 0%,
        transparent 50%
      ),
      linear-gradient(180deg, #1a1a25 0%, #2a2a35 50%, #1a1a25 100%);
    color: white;
    height: 100%;
    align-items: center;
    justify-content: center;
  }

  .status_info_logo {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-image: url('../images/dbd_logo_eng_purple.png');
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    animation: blinker 1.5s cubic-bezier(0.5, 0, 1, 1) infinite alternate;
  }

  @keyframes blinker {
    from {
      opacity: 1;
    }

    to {
      opacity: 0.1;
    }
  }

  .close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background: linear-gradient(145deg, #2a2a35 0%, #1a1a25 100%);
    border: 2px solid #e7cda2;
    cursor: pointer;
    transition: all 0.2s ease;
    color: #e7cda2;
    font-size: 20px;
    line-height: 1;
  }
  .close:hover {
    background: linear-gradient(145deg, #3a3a45 0%, #2a2a35 100%);
    border-color: #f0d9b0;
    color: #f0d9b0;
    transform: scale(1.05);
  }
  .close::before {
    content: '✕';
    display: block;
  }
</style>
