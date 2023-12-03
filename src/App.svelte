<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import {
    appEnabled,
    isMobile,
    isConfig,
    killerPerksData,
    survivorPerksData,
    killersData
  } from './lib/Stores/globals'
  import { checkForContainer } from './lib/utils'
  import Lazy from './lib/shared/Lazy.svelte'
  import { Twitch } from './lib/Twitch'

  const ConfigurationHud = () =>
    import('./lib/Configuration/ConfigurationHud.svelte')
  const MobilePerkView = () => import('./lib/Perks/MobilePerkView.svelte')
  const PerksAddonsView = () => import('./lib/PerksAddonsView.svelte')
  const TopHud = () => import('./lib/TopHud.svelte')

  let scale = 1
  let containerRef: HTMLDivElement | undefined

  const fetchData = async <T,>(
    url: string,
    updateFn: (data: (prev: T) => T) => void
  ) => {
    const response = await fetch(
      `https://${import.meta.env?.VITE_FALLBACK_CDN_HOST}/${url}`
    )
    const data = (await response.json()) as T
    updateFn(() => data)
  }

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
  <Lazy component={ConfigurationHud} delayMs={300}>
    Loading configuration...
  </Lazy>
{:else if $isMobile}
  <Lazy component={MobilePerkView} delayMs={300} />
{:else if $appEnabled}
  <div bind:this={containerRef} class="auto-scale">
    <Lazy component={TopHud} delayMs={300} {scale} />
    <div class="dbd-app">
      <div class="yadiv">
        <Lazy component={PerksAddonsView} delayMs={300} />
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
