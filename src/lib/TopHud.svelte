<script lang="ts">
  import PerkToolTipHud from './Perks/PerkTooltipHud.svelte'
  import AddonToolTipHud from './Addons/AddonTooltipHud.svelte'
  import { fade, fly } from 'svelte/transition'
  import { t } from './I18n'
  import type { Addon, Perk } from './Stores/types'
  import type { Nullable } from './types'
  import { visualStore } from './Stores/VisualStore.svelte'
  import { currentGameStateStore } from './Stores/CurrentGameStateStore.svelte'

  let { scale } = $props<{ scale: number }>()

  let visualState = visualStore()
  const currentGameState = currentGameStateStore()

  let addonsAvailable = $derived(
    currentGameState.addons &&
      (currentGameState.addons[0] || currentGameState.addons[1])
  )

  let perkToolTipDisabled = $derived(
    !currentGameState.perks[visualState.hoveredPerk]
  )
  let addonTooltipDisabled = $derived(
    !currentGameState.addons[visualState.hoveredAddon]
  )

  let hoveredPerk: Nullable<Perk> = $derived(
    currentGameState.perks[visualState.hoveredPerk] || null
  )
  let hoveredAddon: Nullable<Addon> = $derived(
    currentGameState.addons[visualState.hoveredAddon]
  )
</script>

<div
  class="global_hud"
  style={`transform: translate(-50%, -50%) scale(${scale})`}
>
  {#if visualState.helperInfoShowing}
    <div class="hover-over-perks" out:fade in:fly={{ y: -50, duration: 500 }}>
      {t('show.perks')} ⮞
    </div>
    {#if addonsAvailable}
      <div
        class="hover-over-addons"
        out:fade
        in:fly={{ y: -50, duration: 500 }}
      >
        ⮜ {t('show.addons')}
      </div>
    {/if}
  {/if}

  <PerkToolTipHud disabled={perkToolTipDisabled} {hoveredPerk} />
  <AddonToolTipHud disabled={addonTooltipDisabled} {hoveredAddon} />
</div>

<style>
  @keyframes infoTextPerk {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.15);
    }
    60% {
      transform: scale(1);
    }
    70% {
      transform: scale(1.1);
    }
    80% {
      transform: scale(1);
    }
    90% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }
  .hover-over-perks {
    bottom: 15%;
    right: 18%;
    background-image: linear-gradient(to right, #0f0c29, #302b63, #24243e);
    padding: 5px 10px;
    border-radius: 3px;
    color: white;
    font: 18px 'Inter' sans-serif;
    animation: infoTextPerk 5s infinite 0.5s;
    position: absolute;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    pointer-events: none;
  }

  @keyframes infoTextAddon {
    0% {
      transform: translateX(0px);
    }
    25% {
      transform: translateX(18px);
    }
    50% {
      transform: translateX(0px);
    }
    100% {
      transform: translateX(0px);
    }
  }

  .hover-over-addons {
    bottom: 10%;
    left: 21%;
    background-image: linear-gradient(to right, #0f0c29, #302b63, #24243e);
    padding: 5px 10px;
    border-radius: 3px;
    color: white;
    font: 18px 'Inter' sans-serif;
    animation: infoTextAddon 2.5s infinite 0.5s;
    position: absolute;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    pointer-events: none;
  }

  .global_hud {
    width: 1920px;
    height: 1080px;
    left: 50%;
    top: 50%;
    position: absolute;
    transform: translate(-50%, -40%);
  }
</style>
