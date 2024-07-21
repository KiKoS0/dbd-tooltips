import { writable, type Writable } from 'svelte/store'
import type { DbdUIScale } from '../Twitch/types'
import type { AddonsLoadout, PerksLoadout, UserData } from './types'

export const perkStore: Writable<PerksLoadout> = writable([
  null,
  null,
  null,
  null
])
export const addonStore: Writable<AddonsLoadout> = writable([null, null])

export const hudSize: Writable<DbdUIScale> = writable('100')

export const userData: Writable<UserData | null> = writable(null)

export const showInfo = writable(false)
