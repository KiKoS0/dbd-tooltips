<script module>
  import { visualStore } from './../Stores/VisualStore.svelte.ts'
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import PerkTooltipHud from './PerkTooltipHud.svelte'

  import survivorPerkDic from '../../stories/assets/survivor_perks.json'
  import killerPerkDic from '../../stories/assets/killer_perks.json'

  const vizStore = visualStore()

  const { Story } = defineMeta({
    title: 'HUD/PerkTooltipHud',
    component: PerkTooltipHud,
    args: {
      actorType: 'killer',
      survivorPerkId: 'Adrenaline',
      killerPerkId: 'Corrupt_Intervention',
      mobileMode: false,
      disabled: false
    },
    argTypes: {
      actorType: {
        name: 'Actor Type',
        control: { type: 'select' },
        options: ['killer', 'survivor']
      },
      survivorPerkId: {
        name: 'Survivor Perk ID',
        control: { type: 'select' },
        options: survivorPerkDic
      },
      killerPerkId: {
        name: 'Killer Perk ID',
        control: { type: 'select' },
        options: killerPerkDic
      }
    }
  })
</script>

<Story name="Tooltip">
  {#snippet children(args)}
    <PerkTooltipHud
      hoveredPerk={{
        id:
          args.actorType === 'killer' ? args.killerPerkId : args.survivorPerkId,
        actor: args.actorType
      }}
    />
    <button on:click={vizStore.toggleChangelogs}>Toggle changelogs</button>
  {/snippet}
</Story>
