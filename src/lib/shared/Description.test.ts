import { render, screen, waitFor } from '@testing-library/svelte'
import { beforeAll, describe, expect, it } from 'vitest'

import Description from './Description.svelte'
import perks from '../../../tests/fixtures/survivors.json'
import { visualStore } from '../Stores/VisualStore.svelte'
import { waitForResources } from '../../test/helpers'

const perk = perks['Adrenaline']

describe('Description', () => {
  beforeAll(waitForResources)

  it('renders correctly', () => {
    const expected =
      'You are fuelled by unexpecting energy when on the verge of escape'

    render(Description, { ...perk })
    expect(screen.getByText(expected)).toBeInTheDocument()
  })

  it('rewrites icon url to CDN`s', async () => {
    render(Description, { ...perk })

    await waitFor(() => {
      const images = screen.getAllByRole<HTMLImageElement>('img')
      const iconImage = images.find((img) => img.alt === 'IconHelp addons')
      expect(iconImage?.src).toBe(
        `https://${import.meta.env.VITE_CDN_HOST}/images/icons/IconHelp_addons.png`
      )
    })
  })

  it('shows changelogs when triggered', async () => {
    render(Description, { ...perk })

    const changelogsElement = screen.getByTestId('description.changelogs')
    expect(changelogsElement).toHaveClass('changelog-content-hidden')

    visualStore().toggleChangelogs()

    await waitFor(async () => {
      expect(changelogsElement).not.toHaveClass('changelog-content-hidden')
      expect(await screen.findByText('Patch 7.7.0')).toBeInTheDocument()
    })
  })
})
