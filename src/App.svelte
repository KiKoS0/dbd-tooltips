<script lang="ts">
  import ConfigurationHud from './lib/Configuration/ConfigurationHud.svelte'
  import { onDestroy, onMount } from 'svelte'
  import {
    appEnabled,
    isMobile,
    isConfig,
    killerPerksData,
    survivorPerksData,
    killersData,
    featureFlagsData
  } from './lib/Stores/globals'
  import { checkForContainer } from './lib/utils'
  import { Twitch } from './lib/Twitch'
  import MobilePerkView from './lib/Perks/MobilePerkView.svelte'
  import TopHud from './lib/TopHud.svelte'
  import PerksAddonsView from './lib/PerksAddonsView.svelte'
  import { fetchData } from './lib/Twitch/utils'

  let scale = 1
  let containerRef: HTMLDivElement | undefined

  const initialize = () => {
    // Check if config mode
    if (checkForContainer('dbd_config_container')) {
      isConfig.update(() => true)
      return
    }

    // Check if mobile mode
    if (checkForContainer('dbd_mobile_container')) {
      isMobile.update(() => true)
    }

    fetchData('killers.json', killerPerksData.update)
    fetchData('survivors.json', survivorPerksData.update)
    fetchData('powers.json', killersData.update)
    fetchData('feature_flags.json', featureFlagsData.update)
  }

  onMount(() => initialize())

  const resizeObserver = new ResizeObserver((entries) => {
    scale = (entries?.[0]?.contentRect?.height || 540) / 1080
  })

  $: containerRef && resizeObserver.observe(containerRef)

  onDestroy(() => resizeObserver.disconnect())
</script>

<Twitch />
{#if $isConfig}
  <ConfigurationHud>Loading configuration...</ConfigurationHud>
{:else if $isMobile}
  <MobilePerkView />
{:else if $appEnabled}
  <div bind:this={containerRef} class="auto-scale">
    <TopHud {scale} />
    <div class="dbd-app">
      <div class="yadiv">
        <PerksAddonsView />
      </div>
    </div>
  </div>
{/if}

<svelte:head>
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<style>
  .auto-scale {
    width: 100%;
    height: 100%;
    position: absolute;
  }
  .yadiv {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0%;
  }
  .dbd-app {
    width: 100vw;
    height: 100vh;
    user-select: none;
    position: absolute;
  }
</style>
