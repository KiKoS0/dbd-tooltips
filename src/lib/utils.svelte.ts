import { t } from './I18n'
import type { AddonEntry, PerkEntry } from './Stores/types'

export function getTimeout(ttl: number | string | Date): number {
  const ttlDate: Date = new Date(ttl)
  const now: Date = new Date(Date.now())
  const diff: number = ttlDate.getTime() - now.getTime()
  return diff
}
export const noop = () => false

export function getRandom(max: number): number {
  return Math.random() * max
}

export const lessThanFourMinsAgo = (date: number): boolean => {
  const FOUR_MINS: number = 60 * 4 * 1000 /* ms */
  const anHourAgo: number = Date.now() - FOUR_MINS

  return date > anHourAgo
}

export function checkForContainer(name: string): boolean {
  return document.getElementsByClassName(name).length > 0
}

const EMPTY_PERK: PerkEntry = $derived({
  gif: './images/empty_perk.png',
  name: t('perk.unknown.name'),
  description: t('perk.unknown.description'),
  character: t('perk.unknown.character'),
  changelogs: '',
  frames: [],
  icon_alt: 'empty_perk.png',
  icon_src: '',
  link: '',
  locales: {}
})

const EMPTY_ADDON: AddonEntry = $derived({
  name: t('addon.unknown.name'),
  description: t('addon.unknown.description'),
  img_alt: 'empty_perk.png',
  img_path: './images/empty_perk.png',
  img_src: './images/empty_perk.png',
  link: ''
})

export const emptyPerk = () => EMPTY_PERK
export const emptyAddon = () => EMPTY_ADDON

export const generateGifSrc = (relativePath?: string) =>
  relativePath &&
  `https://${import.meta.env?.VITE_CDN_HOST}/${relativePath.replace(/^data\//, '')}`
