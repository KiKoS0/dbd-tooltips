import { writable, type Writable } from 'svelte/store'
import type { UserData } from './types'

export const userData: Writable<UserData | null> = writable(null)
