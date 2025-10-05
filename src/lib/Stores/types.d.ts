import type { Nullable } from '../types'

type AddonShowControl = -1 | 0 | 1
type PerkShowControl = -1 | 0 | 1 | 2 | 3

export type Perk = { id: string; actor: 'survivor' | 'killer' }
export type Addon = { id: string; killerId: string }

export type AddonsLoadout = Nullable<Addon>[]
export type PerksLoadout = Nullable<Perk>[]

export type UserData = { token: string; channelId: string; userId?: string }

type PerkEntry = {
  name: string
  character: string
  character_link: string
  description: string
  changelogs: string
  frames: string[]
  gif: string
  icon_alt: string
  icon_src: string
  link: string
  locales: Record<string, string>
}

export type PerkEntries = Record<string, PerkEntry>

type AddonEntry = {
  name: string
  description: string
  img_alt: string
  img_path: string
  img_src: string
  link: string
}

type KillerEntry = {
  addons: Record<string, AddonEntry>
  link: string
  name: string
  power_name: string
  power_imgs: string[]
  power_imgs_paths: string[]
}

export type KillerEntries = Record<string, KillerEntry>

export type LocalizedPerkEntry = {
  name: string
  desc: string
  link: string
}
export type LocalizedPerkEntries = Record<string, LocalizedPerkEntry | never>

export type FeatureFlagEntries = Record<string, boolean>
