<script lang="ts">
  import PerkToolTipHud from './Perks/PerkTooltipHud.svelte'
  import { fade, fly } from 'svelte/transition'
  import type { Perk } from './Stores/types'
  import type { Nullable } from './types'
  import { visualStore } from './Stores/VisualStore.svelte'
  import { currentGameStateStore } from './Stores/CurrentGameStateStore.svelte'

  let { scale } = $props<{ scale: number }>()

  let visualState = visualStore()
  const currentGameState = currentGameStateStore()

  let perkToolTipDisabled = $derived(
    !currentGameState.perks[visualState.hoveredPerk]
  )

  let hoveredPerk: Nullable<Perk> = $derived(
    currentGameState.perks[visualState.hoveredPerk] || null
  )
</script>

<div
  class="global_hud"
  style={`transform: translate(-50%, -50%) scale(${scale})`}
>
  {#if visualState.helperInfoShowing}
    <div
      class="hover-over-perks"
      style="right: {parseInt(currentGameState.hudSize) < 100 ? 5 : 8}%;"
      out:fade
      in:fly={{ y: -50, duration: 500 }}
    >
      Perks are available
      <img src="/images/hand-point-down-regular-full.svg" alt="pointing down" />
    </div>
  {/if}

  <PerkToolTipHud disabled={perkToolTipDisabled} {hoveredPerk} />
</div>

<style>
  @keyframes bounce {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(8px);
    }
  }

  .hover-over-perks {
    bottom: 30%;
    background: linear-gradient(145deg, #1a1a1a 0%, #0f0f0f 100%);
    border: 2px solid #e7cda2;
    padding: 8px 16px;
    border-radius: 8px;
    color: #e7cda2;
    font:
      500 16px 'Inter',
      sans-serif;
    position: absolute;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    pointer-events: none;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.5);
    animation: bounce 2s ease-in-out infinite;
  }

  .hover-over-perks img {
    width: 20px;
    height: 20px;
    filter: brightness(0) saturate(100%) invert(83%) sepia(14%) saturate(1064%)
      hue-rotate(358deg) brightness(96%) contrast(85%);
  }

  .global_hud {
    width: 1920px;
    height: 1080px;
    left: 50%;
    top: 50%;
    position: absolute;
    transform: translate(-50%, -40%);
    pointer-events: none;
  }
</style>
