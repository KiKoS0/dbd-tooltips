import { derived, writable, type Writable } from 'svelte/store'
import translations from './translations'

export type Locale = 'en' | 'fr' | 'es' // Add more supported locales if needed

const defaultLocale: Locale = 'en'

export const locale: Writable<Locale> = writable(defaultLocale)

export const locales: Locale[] = Object.keys(translations) as Locale[]

function translate(
  locale: Locale,
  key: string,
  vars: Record<string, string>
): string {
  if (!key) throw new Error('no key provided to $t()')
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

export const t = derived(
  locale,
  ($locale: Locale) =>
    (key: string, vars: Record<string, string> = {}): string =>
      translate($locale, key, vars)
)
