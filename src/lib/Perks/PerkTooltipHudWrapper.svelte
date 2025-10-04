<script lang="ts">
  import PerkTooltipHud from './PerkTooltipHud.svelte'
  import { visualStore } from '../Stores/VisualStore.svelte'

  let {
    actorType = 'killer',
    killerPerkId = 'Corrupt_Intervention',
    survivorPerkId = 'Adrenaline',
    mobileMode = false,
    disabled = false,
    showChangelogs = false
  } = $props()

  const hoveredPerk = $derived({
    id: actorType === 'killer' ? killerPerkId : survivorPerkId,
    actor: actorType
  })

  const vizStore = visualStore()

  // Toggle changelogs based on the control
  $effect(() => {
    if (showChangelogs && !vizStore.changelogsShowing) {
      vizStore.toggleChangelogs()
    } else if (!showChangelogs && vizStore.changelogsShowing) {
      vizStore.toggleChangelogs()
    }
  })
</script>

<PerkTooltipHud {hoveredPerk} {mobileMode} {disabled} />
