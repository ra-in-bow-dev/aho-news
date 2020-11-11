import { Writable, writable, derived, Readable } from 'svelte/store'
import type { ConnectedPeer, SBClientOptions, Switchboard as SBType } from 'switchboard.js'
import { Switchboard } from 'switchboard.js'

export interface Message {
    id: string,
    body: string,
    reply_to?: string
}

export const options: SBClientOptions = {
    trackers: [
      'wss://tracker.sloppyta.co:443/announce',
      'wss://tracker.files.fm:7073/announce',
      'wss://tracker.openwebtorrent.com'
    ]
  }

export const connection: Writable<Switchboard> = writable(new Switchboard(options))
export const peers: Readable<Array<ConnectedPeer>> = derived([connection], ($connection, $peers) => {
    const onmsg = async (peer: ConnectedPeer, ev: MessageEvent<string>) => {
        const msg: Message = await JSON.parse(ev.data)
        // TODO: store message
    }
    $connection.on('peer', (peer: ConnectedPeer) => {
        console.log(`peer ${peer.id} connected`)
        $peers.push(peer)
        peer.on('error', console.error)
        peer.on('close', () => $peers.splice($peers.findIndex((p) => p.id === peer.id), 1))
        peer.on('message', (ev: MessageEvent<string>) => onmsg(peer, ev))
        peer.on('stream', console.debug)
        peer.on('data', console.debug)
    })
    $connection.on('warn', console.warn)
    $connection.swarm('aho-news')
    console.log('p2p connection started')
    return peers
})