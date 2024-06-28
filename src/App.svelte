<script lang="ts">
  import ConfigurationHud from './lib/Configuration/ConfigurationHud.svelte'
  import { onMount } from 'svelte'
  import {
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
  import { appStateStore } from './lib/Stores/AppStateStore.svelte'

  let scale = $state(1)
  let containerRef: HTMLDivElement | null = $state(null)

  let appState = appStateStore()

  const initialize = () => {
    if (checkForContainer('dbd_config_container')) {
      appState.setAppMode('config')
      return
    }

    if (checkForContainer('dbd_mobile_container')) {
      appState.setAppMode('mobile')
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

  $effect(() => {
    if (containerRef) {
      resizeObserver.observe(containerRef)
    }

    return () => resizeObserver.disconnect()
  })
</script>

<Twitch />
{#if appState.isConfig}
  <ConfigurationHud>Loading configuration...</ConfigurationHud>
{:else if appState.isMobile}
  <MobilePerkView />
{:else if appState.enabled}
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
