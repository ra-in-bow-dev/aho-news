import { derived, Readable, Writable, writable } from 'svelte/store'
import type { ConnectedPeer } from 'switchboard.js'
import type { Message } from './message'

// session is a temporary user's profile store
export interface Session {
    timestamp: number
    username?: string
    userpic?: string
    notes?: string[]
}

// settings 
export interface Settings {
    dark?: boolean
    username?: string
    userpic?: string

}
// localStorage
export const settings: Writable<Settings> = writable({})
// 
export const peers: Writable<Map<string, ConnectedPeer>> = writable(new Map())
// each peer has an active session
export const seens: Writable<Map<string, Session>> = writable(new Map()) 
// all the messages in order
export const messages: Writable<Array<Message>> = writable([])
// sorted by timestamp and filtered by reply_to===null messages
export const threads: Readable<Array<Message>> = derived(
  [messages],
  ([$messages]) =>
    $messages
      .filter((m) => !m.reply_to)
      .sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1))
)