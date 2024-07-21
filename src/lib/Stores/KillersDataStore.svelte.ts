import { useApi } from '../Api/useSWR.svelte'
import { getDataUrl } from '../Twitch/utils'
import type { KillerEntries } from './types'

const killersData = useApi<KillerEntries>(getDataUrl('powers.json'))

export const killersDataStore = () => {
  return {
    get data() {
      return killersData.data
    }
  }
}
