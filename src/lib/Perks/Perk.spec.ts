import { render, screen, waitFor, fireEvent } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'

import Perk from './Perk.svelte'
import { currentGameStateStore } from '../Stores/CurrentGameStateStore.svelte'
import { EMPTY_PERKS } from '../Twitch/utils'
import { visualStore } from '../Stores/VisualStore.svelte'

const perkIdx = 0

const currentPerks = [
  { id: 'Adrenaline', actor: 'survivor' } as const,
  null,
  null,
  null
]

describe('Perk', () => {
  it('activates when a perk is assigned to the assigned perk index', async () => {
    const currentGameState = currentGameStateStore()
    currentGameState.setPerks(EMPTY_PERKS)

    render(Perk, { perkIdx })
    expect(screen.getByTestId(`perk-${perkIdx}`)).toHaveClass('disabled')

    currentGameState.setPerks(currentPerks)

    await waitFor(() => {
      expect(screen.getByTestId(`perk-${perkIdx}`)).not.toHaveClass('disabled')
    })
  })

  it('sets the hovered perk index to the visual store when hovering over it', async () => {
    const currentGameState = currentGameStateStore()
    const visualState = visualStore()

    currentGameState.setPerks(currentPerks)
    render(Perk, { perkIdx, enabled: true })
    const perk = screen.getByTestId(`perk-${perkIdx}`)

    expect(visualState.hoveredPerk).not.toBe(perkIdx)

    fireEvent.mouseOver(perk)
    await waitFor(() => {
      expect(visualState.hoveredPerk).toBe(perkIdx)
    })

    fireEvent.mouseOut(perk)
    await waitFor(() => {
      expect(visualState.hoveredPerk).not.toBe(perkIdx)
    })
  })

  it('pins the HUD when clicked', async () => {
    const visualState = visualStore()
    const currentGameState = currentGameStateStore()
    currentGameState.setPerks(currentPerks)

    render(Perk, { perkIdx, enabled: true })
    const perk = screen.getByTestId(`perk-${perkIdx}`)

    expect(visualState.isHudPinned).toBe(false)

    fireEvent.click(perk)
    await waitFor(() => {
      expect(visualState.isHudPinned).toBe(true)
      expect(visualState.hoveredPerk).toBe(perkIdx)
    })
  })
})
