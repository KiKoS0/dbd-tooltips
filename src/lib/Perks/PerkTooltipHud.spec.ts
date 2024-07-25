import { render, screen, waitFor } from '@testing-library/svelte'
import { beforeAll, describe, expect, it } from 'vitest'

import PerkTooltipHud from './PerkTooltipHud.svelte'
import { mainGameStore } from '../Stores/MainGameStore'
import { visualStore } from '../Stores/VisualStore.svelte'

const perkIdx = 0

const currentPerks = [
  { id: 'Adrenaline', actor: 'survivor' } as const,
  null,
  null,
  null
]

describe('PerkTooltipHud', () => {
  const gameStore = mainGameStore()

  beforeAll(async () => {
    await waitFor(() => {
      expect(gameStore.killersData).toBeTruthy()
      expect(gameStore.survivorsData).toBeTruthy()
    })
  })

  it('renders correctly when a hovered perk is set', async () => {
    const { rerender } = render(PerkTooltipHud, {})

    expect(screen.queryByAltText('Adrenaline')).toBeNull()

    await rerender({
      disabled: false,
      hoveredPerk: currentPerks[perkIdx]
    })

    expect(screen.getByAltText('Adrenaline')).toBeInTheDocument()
    expect(screen.getByText('MEG THOMAS PERK')).toBeInTheDocument()
  })

  it('renders correctly for killers', async () => {
    const activePerks = [
      { id: 'Bitter_Murmur', actor: 'killer' } as const,
      null,
      null,
      null
    ]
    render(PerkTooltipHud, {
      disabled: false,
      hoveredPerk: activePerks[perkIdx]
    })

    expect(screen.queryByAltText('Bitter_Murmur')).toBeNull()
  })

  it("shows changelogs of the perk when it's toggled", async () => {
    render(PerkTooltipHud, {
      disabled: false,
      hoveredPerk: currentPerks[perkIdx]
    })

    expect(screen.queryByTestId('description.changelogs')).toBeNull()
    visualStore().toggleChangelogs()

    await waitFor(async () => {
      expect(screen.getByTestId('description.changelogs')).toBeInTheDocument()
    })
  })

  it("shows unknown perk when a perk id doesn't match", async () => {
    render(PerkTooltipHud, {
      disabled: false,
      hoveredPerk: { id: 'newest-perk-ever', actor: 'survivor' }
    })

    expect(screen.getByText('Unknown Perk')).toBeInTheDocument()
    expect(screen.getByAltText('empty_perk.png')).toBeInTheDocument()
  })
})
