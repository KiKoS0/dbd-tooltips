import { waitFor } from '@testing-library/svelte'
import { expect } from 'vitest'
import { mainGameStore } from '../lib/Stores/MainGameStore'
import { localizationStore } from '../lib/Stores/LocalizationStore.svelte'

export const waitForResources = async () => {
  const gameStore = mainGameStore()
  const localization = localizationStore()

  await waitFor(
    () => {
      expect(gameStore.killersData).toBeTruthy()
      expect(gameStore.survivorsData).toBeTruthy()
      expect(gameStore.killersMetadata).toBeTruthy()
      expect(localization.supportedLocales).toBeTruthy()
    },
    { timeout: 5000 }
  )
}
