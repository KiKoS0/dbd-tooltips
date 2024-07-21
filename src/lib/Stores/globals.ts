import { writable, type Writable } from 'svelte/store'
import type { DbdUIScale } from '../Twitch/types'
import type {
  AddonsLoadout,
  KillerEntries,
  LocalizedPerkEntries,
  PerkEntries,
  PerksLoadout,
  UserData
} from './types'

export const perkStore: Writable<PerksLoadout> = writable([
  null,
  null,
  null,
  null
])
export const addonStore: Writable<AddonsLoadout> = writable([null, null])

export const hudSize: Writable<DbdUIScale> = writable('100')

export const userData: Writable<UserData | null> = writable(null)

export const killersData: Writable<KillerEntries | undefined> =
  writable(undefined)
export const killerPerksData: Writable<PerkEntries | undefined> =
  writable(undefined)
export const survivorPerksData: Writable<PerkEntries | undefined> =
  writable(undefined)

export const localizedKillerPerksData: Writable<LocalizedPerkEntries> =
  writable({})
export const localizedSurvivorPerksData: Writable<LocalizedPerkEntries> =
  writable({})

export const showInfo = writable(false)
