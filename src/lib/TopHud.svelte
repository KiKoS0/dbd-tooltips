<script lang="ts">
  import {
    showPerk,
    showAddon,
    perkStore,
    addonStore,
    showInfo
  } from './Stores/globals'
  import { onDestroy } from 'svelte'
  import PerkToolTipHud from './Perks/PerkTootipHud.svelte'
  import AddonToolTipHud from './Addons/AddonTooltipHud.svelte'
  import { fade, fly } from 'svelte/transition'
  import { t } from './I18n'
  import type { Addon, Perk } from './Stores/types'
  import type { Nullable } from './types'

  $: addonsAvailable = $addonStore && ($addonStore[0] || $addonStore[1])

  let perk_tooltip_disabled = true
  let addon_tooltip_disabled = true
  let hoveredPerk: Nullable<Perk> = null
  let hoveredAddon: Nullable<Addon> = null

  export let scale = 1

  const unsubscribe_perk = showPerk.subscribe((value) => {
    if (value >= 0) {
      const perk = $perkStore[value]
      if (perk) {
        perk_tooltip_disabled = false
        hoveredPerk = $perkStore[value]
      }
    } else {
      perk_tooltip_disabled = true
    }
  })

  const unsubscribe_addon = showAddon.subscribe((value) => {
    if (value >= 0) {
      const addon = $addonStore[value]
      if (addon) {
        addon_tooltip_disabled = false
        hoveredAddon = $addonStore[value]
      }
    } else {
      addon_tooltip_disabled = true
    }
  })

  // setInterval((x) => {
  //   // Hack to always enable hud for debug
  //   // hoveredAddon = true;
  //   addon_tooltip_disabled = false;
  // }, 100);

  onDestroy(unsubscribe_perk)
  onDestroy(unsubscribe_addon)
</script>

<div
  class="global_hud"
  style={`transform: translate(-50%, -50%) scale(${scale})`}
>
  {#if $showInfo}
    <div class="hover-over-perks" out:fade in:fly={{ y: -50, duration: 500 }}>
      {$t('show.perks')} ⮞
    </div>
    {#if addonsAvailable}
      <div
        class="hover-over-addons"
        out:fade
        in:fly={{ y: -50, duration: 500 }}
      >
        ⮜ {$t('show.addons')}
      </div>
    {/if}
  {/if}

  <PerkToolTipHud disabled={perk_tooltip_disabled} {hoveredPerk} />
  <AddonToolTipHud disabled={addon_tooltip_disabled} {hoveredAddon} />
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
