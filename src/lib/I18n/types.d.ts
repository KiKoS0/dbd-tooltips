import type { translations } from './translations'
export type Locale = keyof typeof translations
export type TranslationKey = keyof (typeof translations)[Locale]
