import translations from './translations'
import type { Locale } from './types'
import {
  defaultLocale,
  localizationStore
} from '../Stores/localizationStore.svelte'

export const locales: Locale[] = Object.keys(translations) as Locale[]

const localeStore = localizationStore()

function translate(
  locale: Locale,
  key: string,
  vars: Record<string, string>
): string {
  if (!key) throw new Error('no key provided to t()')
  if (!locale) throw new Error(`no translation for key "${key}"`)

  // Grab the translation from the translations object.
  let text: string | undefined =
    translations[locale]?.[key] || translations[defaultLocale]?.[key]

  if (!text) throw new Error(`no translation found for ${locale}.${key}`)

  // Replace any passed-in variables in the translation string.
  Object.keys(vars).forEach((k) => {
    const regex = new RegExp(`{{${k}}}`, 'g')
    text = text?.replace(regex, vars[k])
  })

  return text
}

export const t = (key: string, vars: Record<string, string> = {}) =>
  translate(localeStore.locale, key, vars)
