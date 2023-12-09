import { featureFlagsData } from './Stores/globals'
import { get } from 'svelte/store'
import type { AddonEntry, PerkEntry } from './Stores/types'

export function getTimeout(ttl: number | string | Date): number {
  const ttlDate: Date = new Date(ttl)
  const now: Date = new Date(Date.now())
  const diff: number = ttlDate.getTime() - now.getTime()
  return diff
}

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

export const isFirefox = () => /firefox/i.test(navigator.userAgent)

export const featureFlagEnabled = (flag: string) =>
  get(featureFlagsData)?.[flag] || false

export const EMPTY_PERK: PerkEntry = {
  gif: './images/empty_perk.png',
  name: 'Unknown Perk',
  description:
    "Oups I don't actually know what perk is that, please force refresh the page or contact the developers if that doesn't help.",
  character: 'Unknown',
  changelogs: '',
  frames: [],
  icon_alt: 'empty_perk.png',
  icon_src: '',
  link: '',
  locales: {}
}

export const EMPTY_ADDON: AddonEntry = {
  name: 'Unknown Perk',
  description:
    "Oups I don't actually know what perk is that, please force refresh the page or contact the developers if that doesn't help.",
  img_alt: 'empty_perk.png',
  img_path: './images/empty_perk.png',
  img_src: './images/empty_perk.png',
  link: ''
}
