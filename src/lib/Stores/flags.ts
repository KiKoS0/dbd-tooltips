import { get, writable } from 'svelte/store'
import { featureFlagsData } from './globals'

export const featureFlagEnabled = (flag: string) => {
  const enabled = writable<boolean>(get(featureFlagsData)?.[flag] || false)
  featureFlagsData.subscribe((flags) =>
    enabled.update(() => flags?.[flag] || false)
  )
  return enabled
}
