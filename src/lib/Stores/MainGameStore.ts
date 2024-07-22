import { useApi } from '../Api/useApi.svelte'
import { getDataUrl } from '../Twitch/utils'
import type { KillerEntries, PerkEntries } from './types'

const killersMetadata = useApi<KillerEntries>(getDataUrl('powers.json'))
const killersData = useApi<PerkEntries>(getDataUrl('killers.json'))
const survivorsData = useApi<PerkEntries>(getDataUrl('survivors.json'))

export const mainGameStore = () => {
  return {
    get killersData() {
      return killersData.data
    },
    get killersMetadata() {
      return killersMetadata.data
    },
    get survivorsData() {
      return survivorsData.data
    }
  }
}
