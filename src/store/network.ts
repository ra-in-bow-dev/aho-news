import { Writable, writable } from 'svelte/store'
import type { SBClientOptions, Switchboard as SBType } from 'switchboard.js'
import { Switchboard } from 'switchboard.js'

export const options: SBClientOptions = {
  trackers: [
    'wss://tracker.sloppyta.co:443/announce',
    'wss://tracker.files.fm:7073/announce',
    'wss://tracker.openwebtorrent.com',
  ]
}

export const connection: Writable<SBType> = writable(new Switchboard(options))