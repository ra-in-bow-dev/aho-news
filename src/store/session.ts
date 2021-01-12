import { Writable, writable } from 'svelte/store'
import type { ConnectedPeer } from 'switchboard.js'
import type { Message } from './message'

export const currentSwarm: Writable<string> = writable('aho-news')

// session is a temporary user's profile store
export interface Session {
  peerId: string
  timestamp: number
  username?: string
  userpic?: string
  notes?: string[]
}

// settings
export interface Settings {
  username?: string
  userpic?: string
}
// localStorage
export const settings: Writable<Settings> = writable({})
//
export const peers: Writable<Map<string, ConnectedPeer>> = writable(new Map())
// each peer has an active session
export const seens: Writable<Map<string, Session>> = writable(new Map())

export const content: Writable<Map<string, string>> = writable(new Map())