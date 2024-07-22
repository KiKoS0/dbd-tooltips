<script lang="ts">
  import AddonTooltipHud from './../Addons/AddonTooltipHud.svelte'
  import MobilePerk from './MobilePerk.svelte'
  import { onMount } from 'svelte'
  import PerkTootipHud from './PerkTootipHud.svelte'

  import { fade, fly } from 'svelte/transition'
  import type {
    Perk,
    Addon,
    PerkShowControl,
    AddonShowControl
  } from '../Stores/types'
  import type { Nullable } from '../types'
  import MobileAddon from './MobileAddon.svelte'
  import { t } from '../I18n'
  import { appStateStore } from '../Stores/AppStateStore.svelte'
  import { visualStore } from '../Stores/VisualStore.svelte'
  import { currentGameStateStore } from '../Stores/CurrentGameStateStore.svelte'

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
  let hoveredAddon: Nullable<Addon> = $derived(
    currentGameState.addons[visualState.hoveredAddon]
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
    perk_info_img: 'overflow-y: auto;',
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
      <div class="mobile_addon_hud">
        {#each currentGameState.addons as _, i}
          <MobileAddon number={i as AddonShowControl} />
        {/each}
      </div>
      <a href="https://www.patreon.com/kikos" target="_blank">
        <div in:fly={{ x: 50, duration: 500 }} class="support-us">
          <div style="margin-bottom: 3px;">{t('support')}</div>
          <img src="images/patreon.png" alt="Support us" />
        </div>
      </a>
    {:else}
      <div id="btn-wrapper">
        <span
          onclick={goBack}
          onkeyup={goBack}
          class="close warp black"
          style={landscapeMode ? fixSmallWidthStuff('close') : ''}
          role="button"
          tabindex="0"
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
    <AddonTooltipHud
      mobileMode={true}
      disabled={!currentlyShowingAddon}
      {landscapeMode}
      {hoveredAddon}
    />
  </div>
{/if}

<style>
  .support-us {
    position: fixed;
    bottom: 0%;
    right: 0%;
    color: #b0a8b9;
    display: flex;
    gap: 5px;
    font-size: 16px;
    align-items: center;
  }
  .support-us img {
    height: 16px;
    width: 16px;
  }
  .main_screen_header {
    text-align: center;
    font-size: 24px;
    font-family: 'Roboto', sans-serif;
    font-weight: 300;
    margin-top: 10px;
  }
  #btn-wrapper {
    display: flex;
    position: sticky;
    justify-content: center;
  }
  #btn-wrapper span {
    margin: 10px auto;
  }
  .mobile_perk_hud {
    width: 572px;
    height: auto;
    flex-wrap: wrap;
    display: flex;
    gap: 60px 60px;
    position: absolute;
    top: 40%;
    left: 53%;
  }
  .perk_info_img {
    background: #0b0b0b;
    color: white;
    height: 100%;
    overflow-y: hidden;
    overflow-x: hidden;
  }
  .status_info {
    background: #0b0b0b;
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

  .mobile_addon_hud {
    position: absolute;
    display: flex;
    justify-content: center;
    gap: 5vw;
    top: 67%;
    width: 100%;
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
    position: relative;
    display: inline-block;
    width: 40px;
    height: 40px;
    overflow: hidden;
  }
  .close:hover::before,
  .close:hover::after {
    background: rgba(98, 0, 255, 0.637);
  }
  .close::before,
  .close::after {
    content: '';
    position: absolute;
    height: 2px;
    width: 100%;
    top: 50%;
    left: 0;
    margin-top: -1px;
    background: #000;
  }
  .close::before {
    transform: rotate(45deg);
    background: white;
  }
  .close::after {
    transform: rotate(-45deg);
    background: white;
  }
  .close.warp::before,
  .close.warp::after {
    border-radius: 120% 0;
  }
  .close.black::before,
  .close.black::after {
    height: 8px;
    margin-top: -4px;
  }
</style>
