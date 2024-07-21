import { useApi } from '../Api/useSWR.svelte'
import type { Locale } from '../I18n/types'
import { getDataUrl } from '../Twitch/utils'
import type { LocalizedPerkEntries } from './types'

export const defaultLocale: Locale = 'en'

const urlParams = new URLSearchParams(window.location.search)
const suggestedLocale = (urlParams.get('language') || 'en') as Locale

const supportedLocales = useApi<Locale[]>(getDataUrl(`supported_locales.json`))

const locale: Locale = $derived(
  supportedLocales.data?.includes(suggestedLocale)
    ? suggestedLocale
    : defaultLocale
)

// The english version is always loaded in the main game json files.
const killersLocalizationData = $derived(
  useApi<LocalizedPerkEntries>(
    locale !== 'en' ? getDataUrl(`locales/killers_${locale}.json`) : undefined
  )
)
const survivorsLocalizationData = $derived(
  useApi<LocalizedPerkEntries>(
    locale !== 'en' ? getDataUrl(`locales/killers_${locale}.json`) : undefined
  )
)

export const localizationStore = () => {
  return {
    get locale() {
      return locale
    },
    get killersLocalizationData() {
      return killersLocalizationData.data
    },
    get survivorsLocalizationData() {
      return survivorsLocalizationData.data
    }
  }
}
