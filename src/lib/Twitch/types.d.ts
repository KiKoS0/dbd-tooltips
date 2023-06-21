import type { Nullable } from '../types'

export type TwitchAuthPayload = {
  token: string
  channelId: string
}

export type TwitchExtensionContext = {
  game: string
  mode: 'viewer' | 'dashboard' | 'config'
  isFullScreen: boolean
  isMuted: boolean
  isPaused: boolean
  hlsLatencyBroadcaster: number
  displayResolution: string
  bufferSize: number
  bitrate: number
  arePlayerControlsVisible: boolean
  language: string // This is the broadcaster's language not the viewer's
  theme: 'light' | 'dark'
  videoResolution: string
  volume: number
}

export type AddonsLoadoutPayload = [Nullable<string>, Nullable<string>]
export type PerksLoadoutPayload = [
  Nullable<string>,
  Nullable<string>,
  Nullable<string>,
  Nullable<string>
]
export type DbdKiller = string

export type DbdUIScale = '70' | '75' | '80' | '85' | '90' | '95' | '100'

export type DbdLoadoutPayload = {
  actor: 'killer' | 'survivor'
  channel: string // The channel id
  perks: PerksLoadoutPayload
  ui_scale: DbdUIScale
  ttl: number // Expiration timestamp
  rdm: number // Random jitter in ms for the next request.
  extra: { addons: AddonsLoadoutPayload; killer: DbdKiller } | null
}
