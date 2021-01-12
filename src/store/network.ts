import { Writable, writable } from 'svelte/store'
import type { ConnectedPeer, SBClientOptions, Switchboard as SBType } from 'switchboard.js'
import { Switchboard } from 'switchboard.js'

export const options: SBClientOptions = {
  trackers: [
    'wss://tracker.sloppyta.co:443/announce',
    'wss://tracker.files.fm:7073/announce',
    'wss://tracker.openwebtorrent.com',
    // TODO:'wss://tracker.local' 
    // can be used in tauiri-packed version with node.js engine included
  ]
}

export const connection: Writable<SBType> = writable(new Switchboard(options))

export const peers: Writable<Map<string, ConnectedPeer>> = writable(new Map())
