import { render, screen, waitFor } from '@testing-library/svelte'
import { beforeAll, describe, expect, it } from 'vitest'

import AddonTooltipHud from './AddonTooltipHud.svelte'
import { mainGameStore } from '../Stores/MainGameStore'
import type { Addon } from '../Stores/types'
import type { Nullable } from '../types'

const addonIdx = 0

const currentAddons: [Nullable<Addon>, Nullable<Addon>] = [
  { id: 'Wooden_Horse', killerId: 'Nurse' },
  null
]

describe('AddonTooltipHud', () => {
  const gameStore = mainGameStore()

  beforeAll(async () => {
    await waitFor(() => {
      expect(gameStore.killersMetadata).toBeTruthy()
    })
  })

  it('renders correctly when a hovered addon is set', async () => {
    const { rerender } = render(AddonTooltipHud, {})

    expect(screen.queryByAltText('Adrenaline')).toBeNull()

    await rerender({
      disabled: false,
      hoveredAddon: currentAddons[addonIdx]
    })

    expect(screen.getByText('Wooden Horse')).toBeInTheDocument()
    expect(screen.getByText('Nurse Addon')).toBeInTheDocument()
  })

  it("shows unknown addon when a addon id doesn't match", async () => {
    render(AddonTooltipHud, {
      disabled: false,
      hoveredAddon: { id: 'newest-addon-ever', killerId: 'trapper' }
    })

    expect(screen.getByText('Unknown Addon')).toBeInTheDocument()
  })
})
