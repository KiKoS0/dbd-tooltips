import { render, screen, waitFor } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'

import Description from './Description.svelte'
import perks from '../../../tests/fixtures/survivors.json'
import { visualStore } from '../Stores/VisualStore.svelte'

const perk = perks['Adrenaline']

describe('Description', () => {
  it('renders correctly', () => {
    const expected =
      'You are fuelled by unexpecting energy when on the verge of escape'

    render(Description, { ...perk })
    expect(screen.getByText(expected)).toBeInTheDocument()
  })

  it('rewrites icon url to CDN`s', () => {
    render(Description, { ...perk })

    const img = screen.getByRole<HTMLImageElement>('img')

    expect(img.src).toBe(
      `https://${import.meta.env.VITE_CDN_HOST}/images/icons/IconHelp_addons.png`
    )
  })

  it('shows changelogs when triggered', async () => {
    render(Description, { ...perk })
    expect(screen.queryByText('Patch 7.7.0')).toBeNull()

    visualStore().toggleChangelogs()

    await waitFor(async () => {
      expect(await screen.findByText('Patch 7.7.0')).toBeInTheDocument()
    })
  })
})
