import { userDataStore } from '../Stores/UserStore.svelte'
import { appStateStore } from '../Stores/AppStateStore.svelte'
import { featureFlagsStore } from '../Stores/FeatureFlagsStore.svelte'

const INNGEST_EVENT_KEY =
  'vLypz3dKsJZJqddjZU_qmHnaoVjxANVv0II8g8BnvTArIIjj4QiSEV1Wsfb-59Z-fwrdQF51izZSGR5lH0C8lA'
const INNGEST_ENDPOINT = 'https://inn.gs/e'

interface InngestEventData {
  name: string
  data: Record<string, unknown>
}

const trackEvent = async (
  eventName: string,
  data: Record<string, unknown> = {}
): Promise<void> => {
  try {
    const payload: InngestEventData = {
      name: eventName,
      data
    }

    await fetch(`${INNGEST_ENDPOINT}/${INNGEST_EVENT_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
  } catch (error) {
    console.error('Failed to track event:', error)
  }
}

export const track = (
  action: string,
  additionalData: Record<string, unknown> = {}
): void => {
  const featureFlags = featureFlagsStore()

  if (!featureFlags.enabled('enable-analytics')) {
    return
  }

  const userData = userDataStore().userData
  const appState = appStateStore()

  const mode = appState.isConfig
    ? 'config'
    : appState.isMobile
      ? 'mobile'
      : 'overlay'

  trackEvent(`app/user.${action}`, {
    userId: userData?.userId,
    channelId: userData?.channelId,
    mode,
    timestamp: new Date().toISOString(),
    ...additionalData
  })
}
