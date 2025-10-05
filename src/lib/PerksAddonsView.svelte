<script lang="ts">
  import Perk from './Perks/Perk.svelte'
  import Addon from './Addons/Addon.svelte'
  import type { PerkShowControl, AddonShowControl } from './Stores/types'
  import { currentGameStateStore } from './Stores/CurrentGameStateStore.svelte'

  const currentGameState = currentGameStateStore()

  const perksIdxs: PerkShowControl[] = [0, 1, 3, 2]
  const addonsIdxs: AddonShowControl[] = [0, 1]
</script>

<div class="perks_hud {`perks_hud_${currentGameState.hudSize}`}">
  {#each perksIdxs as i}
    <Perk perkIdx={i} />
  {/each}
</div>
<div class="addons_hud {`addons_hud_${currentGameState.hudSize}`}">
  {#each addonsIdxs as i}
    <Addon addonIdx={i} />
  {/each}
</div>

<style>
  .perks_hud {
    position: absolute;
    gap: 15%;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    transform: rotate(45deg);
    pointer-events: auto;
  }

  .refresh-btn {
    /* z-index: 6; */
    bottom: 50%;
    right: 90%;
    position: absolute;
  }

  .perks_hud_70 {
    width: 6.3%;
    height: 11.2%;
    right: 3.7%;
    bottom: 6.05%;
  }
  .perks_hud_75 {
    width: 6.7%;
    height: 11.911%;
    right: 4%;
    bottom: 6.7%;
  }
  .perks_hud_80 {
    width: 7%;
    height: 12.444%;
    right: 4.35%;
    bottom: 7.5%;
  }
  .perks_hud_85 {
    width: 8%;
    height: 14.222%;
    right: 4.35%;
    bottom: 7.3%;
  }
  .perks_hud_90 {
    width: 8%;
    height: 14.222%;
    right: 4.9%;
    bottom: 8.1%;
  }
  .perks_hud_95 {
    width: 8.5%;
    height: 15.11%;
    right: 5.1%;
    bottom: 8.6%;
  }
  .perks_hud_100 {
    width: 9%;
    height: 16%;
    right: 5.3%;
    bottom: 9%;
  }

  .addons_hud {
    position: absolute;
    display: flex;
    align-content: flex-start;
    pointer-events: auto;
  }

  .addons_hud_100 {
    width: 7%;
    height: 12%;
    left: 11.15%;
    bottom: 2.3%;
    gap: 11%;
  }

  .addons_hud_95 {
    width: 7%;
    height: 12%;
    left: 10.5%;
    bottom: 1.7%;
    gap: 11%;
  }

  .addons_hud_90 {
    width: 6.5%;
    height: 11.5%;
    left: 10.2%;
    bottom: 1.5%;
    gap: 9%;
  }

  .addons_hud_85 {
    width: 6%;
    height: 10.6%;
    left: 9.5%;
    bottom: 1.6%;
    gap: 13%;
  }

  .addons_hud_80 {
    width: 6%;
    height: 10.6%;
    left: 8.9%;
    bottom: 1%;
    gap: 9%;
  }

  .addons_hud_75 {
    width: 5.5%;
    height: 9.7%;
    left: 8.4%;
    bottom: 1.1%;
    gap: 9%;
  }

  .addons_hud_70 {
    width: 5%;
    height: 8.88%;
    left: 7.8%;
    bottom: 1.2%;
    gap: 12%;
  }
</style>
