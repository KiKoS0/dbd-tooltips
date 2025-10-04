<script module>
  import { visualStore } from './../Stores/VisualStore.svelte.ts'
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import PerkTooltipHudWrapper from './PerkTooltipHudWrapper.svelte'

  import survivorPerkDic from '../../stories/assets/survivor_perks.json'
  import killerPerkDic from '../../stories/assets/killer_perks.json'

  const vizStore = visualStore()

  const { Story } = defineMeta({
    title: 'HUD/PerkTooltipHud',
    component: PerkTooltipHudWrapper,
    args: {
      actorType: 'killer',
      survivorPerkId: 'Adrenaline',
      killerPerkId: 'Remember_Me',
      mobileMode: false,
      disabled: false,
      showChangelogs: false
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
      },
      showChangelogs: {
        name: 'Show Changelogs',
        control: { type: 'boolean' }
      }
    }
  })
</script>

<Story name="Tooltip" />
