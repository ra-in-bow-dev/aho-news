import { derived, Readable, Writable, writable } from 'svelte/store'
import type { ConnectedPeer, SBClientOptions, Switchboard as SBType } from 'switchboard.js'
import { Switchboard } from 'switchboard.js'

export interface Message {
    id: string,         // message id
    type: string,       // can be: image audio video text fix aho rate
    body: string,       // code to inject
    rate: number,       // points of respect
    reply_to?: string,  // other message id
    timestamp?: number, // FIXME
    from?: string       // author peer id
}

export const options: SBClientOptions = {
    trackers: [
      'wss://tracker.sloppyta.co:443/announce',
      'wss://tracker.files.fm:7073/announce',
      'wss://tracker.openwebtorrent.com'
    ]
  }

export const connection: Writable<SBType> = writable(new Switchboard(options))
export const peers: Writable<Map<string, ConnectedPeer>> = writable(new Map())
export const messages: Writable<Array<Message>> = writable([])
export const threads: Readable<Array<Message>> = derived(
    [messages], 
    ([$messages]) => $messages
      .filter(m => !m.reply_to)
      .sort((a,b) => a.timestamp > b.timestamp ? 1 : -1)
    )