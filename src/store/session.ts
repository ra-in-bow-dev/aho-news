import { Readable, derived, Writable, writable } from 'svelte/store'
import generateSession from '../generators/session'
import type { Session } from '../generators/session'
import type { Message } from './message'
import { connection } from './network'

export const username: Writable<string> = writable('me')
export const stream: Writable<MediaStream> = writable(null)
export const speaking: Writable<boolean> = writable(false)
export const currentSwarm: Writable<string> = writable('aho-news') 


export interface Settings {
  width: number
  height: number
  fulscreen: boolean
  username?: string
}

export const defaultSettings: Settings = <Settings><unknown>{
  width: 800, height: 600, fullscreen: false
}

// can set userpic and username
export const profile: Writable<Partial<Session>> = writable({})
export const content: Writable<Message[]> = writable([])
export const settings: Writable<Settings> = writable(defaultSettings)
export const seens: Writable<Map<string, Session>> = writable(new Map())

// used for announce
export const mySession: Readable<Promise<Session>> = derived(
  [connection, profile, currentSwarm],
  async ([$connection, $profile, $currentSwarm]): Promise<Session> =>
    <Session>{ ...(await generateSession($connection.peerID, $currentSwarm)), ...$profile }
)
