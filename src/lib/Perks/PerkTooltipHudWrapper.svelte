<script lang="ts">
  import PerkTooltipHud from './PerkTooltipHud.svelte'

  let {
    actorType = 'killer',
    killerPerkId = 'Corrupt_Intervention',
    survivorPerkId = 'Adrenaline',
    mobileMode = false,
    disabled = false
  } = $props()

  const hoveredPerk = $derived({
    id: actorType === 'killer' ? killerPerkId : survivorPerkId,
    actor: actorType
  })
</script>

<PerkTooltipHud {hoveredPerk} {mobileMode} {disabled} />
