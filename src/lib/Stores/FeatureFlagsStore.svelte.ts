import { useApi } from '../Api/useSWR.svelte'
import { getDataUrl } from '../Twitch/utils'
import type { FeatureFlagEntries } from './types'

const featureFlags = useApi<FeatureFlagEntries>(
  getDataUrl('feature_flags.json')
)

export const featureFlagsStore = () => {
  return {
    enabled: (flag: string) => {
      return featureFlags.data?.[flag] || false
    }
  }
}
