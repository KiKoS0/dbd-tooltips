import { writable, type Writable } from 'svelte/store'
import type { DbdUIScale } from '../Twitch/types'
import type {
  AddonShowControl,
  AddonsLoadout,
  KillerEntries,
  LocalizedPerkEntries,
  PerkEntries,
  PerkShowControl,
  PerksLoadout,
  UserData
} from './types'

export const perkStore: Writable<PerksLoadout> = writable([
  null,
  null,
  null,
  null
])
export const showPerk: Writable<PerkShowControl> = writable(-1)
export const addonStore: Writable<AddonsLoadout> = writable([null, null])
export const showAddon: Writable<AddonShowControl> = writable(-1)

export const hudSize: Writable<DbdUIScale> = writable('100')
export const hudSizeOptions = writable({})

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

export const showChangelogs = writable(false)
export const isMobile = writable(false)
export const showInfo = writable(false)
export const isConfig = writable(false)
export const appEnabled = writable(false)
