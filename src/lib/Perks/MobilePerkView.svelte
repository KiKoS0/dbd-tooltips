<script lang="ts">
  import AddonTooltipHud from './../Addons/AddonTooltipHud.svelte'
  import MobilePerk from './MobilePerk.svelte'
  import { onDestroy, onMount } from 'svelte'
  import PerkTootipHud from './PerkTootipHud.svelte'

  import {
    appEnabled,
    perkStore,
    addonStore,
    showPerk,
    showAddon
  } from '../Stores/globals'
  import { fade, fly } from 'svelte/transition'
  import { log } from '../Twitch/utils'
  import type { Perk, Addon, PerkShowControl } from '../Stores/types'
  import type { Nullable } from '../types'
  import MobileAddon from './MobileAddon.svelte'

  onMount(() => {
    // Yeah, this event kicks whenever it wants it can't be trusted to actually work.
    // Sometimes it does and sometimes it doesn't especially
    // when the orientation is changed by clicking the orientation button
    // landscapeMode = window.matchMedia("(orientation: landscape)").matches;
    // window.addEventListener("orientationchange", function () {
    //   landscapeMode = window.matchMedia("(orientation: landscape)").matches;
    // });
  })

  let landscapeMode = true
  let perkHudScale = 0.4

  let showPerkLock = false
  let hoveredPerk: Nullable<Perk> = null
  let hoveredAddon: Nullable<Addon> = null

  let containerRef: HTMLDivElement | undefined

  const goBack = () => {
    showAddon.update((_) => -1)
    showPerk.update((_) => -1)
  }

  const handleResize = (height: number) => {
    perkHudScale = (height / 534) * 0.4
    log(`perkHudScale: ${perkHudScale}`)
  }

  const cssFixes: { [k: string]: string } = {
    perk_info_img: 'overflow-y: auto;',
    close: 'width: 30px;height: 30px;'
  }

  const fixSmallWidthStuff = (key: string) => {
    if (landscapeMode) return cssFixes[key] || ''
    return ''
  }

  let waitingForData = true

  $: {
    waitingForData = $perkStore.every((x) => x === null)
    log(`Waiting for data: ${waitingForData}`)
  }

  $: {
    if (!perkScreenOpen) {
      showPerkLock = false
    } else if (!showPerkLock) {
      showPerkLock = true
      hoveredPerk = $perkStore[$showPerk]
      hoveredAddon = $addonStore[$showAddon]
    }
  }

  $: perkHudStyle = `transform: translate(-50%, -50%) rotate(45deg) scale(${perkHudScale});`

  $: currentlyShowingPerk = $showPerk !== -1
  $: currentlyShowingAddon = $showAddon !== -1
  $: perkScreenOpen = currentlyShowingPerk || currentlyShowingAddon

  const resizeObserver = new ResizeObserver((entries) =>
    handleResize(entries?.[0]?.contentRect?.height || 540)
  )

  $: containerRef && resizeObserver.observe(containerRef)

  const perksNumbers: PerkShowControl[] = [0, 1, 3, 2]
  onDestroy(() => resizeObserver.disconnect())
</script>

{#if (waitingForData && !showPerkLock) || !$appEnabled}
  <div transition:fade class="status_info">
    <div class="status_info_logo" />
  </div>
{:else}
  <div
    class="perk_info_img"
    bind:this={containerRef}
    style={landscapeMode ? fixSmallWidthStuff('perk_info_img') : ''}
  >
    {#if !perkScreenOpen}
      <div in:fly={{ y: -50, duration: 500 }} class="main_screen_header">
        Current loadout
      </div>
      <div class="mobile_perk_hud" style={perkHudStyle}>
        {#each $perkStore as _, i}
          <MobilePerk number={perksNumbers[i]} />
        {/each}
      </div>
      <div class="mobile_addon_hud">
        {#each $addonStore as _, i}
          <MobileAddon number={i} />
        {/each}
      </div>
      <a href="https://www.patreon.com/kikos" target="_blank">
        <div in:fly={{ x: 50, duration: 500 }} class="support-us">
          <div style="margin-bottom: 3px;">Support us</div>
          <img src="images/patreon.png" alt="Support us" />
        </div>
      </a>
    {:else}
      <div id="btn-wrapper">
        <span
          on:click={goBack}
          on:keyup={goBack}
          class="close warp black"
          style={landscapeMode ? fixSmallWidthStuff('close') : ''}
          role="button"
          tabindex="0"
        />
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
    font-size: 12px;
    align-items: center;
  }
  .support-us img {
    height: 12px;
    width: 12px;
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
