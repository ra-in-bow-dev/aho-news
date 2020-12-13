<script context="module" lang="ts">
const name: string = 'aho-news' // App name
const id: string = 'org.welcomehome.ahonews'

export const navigate = path => {
  window.history.pushState(null, null, path)
  LoadRoute(path)
}
</script>
<script lang="ts">
  import "./global.css"
  import Controls from './Components/Controls.svelte'
  import type { ConnectedPeer } from 'switchboard.js'
  import { connection, peers, seens, messages } from './store/network'
  import type { Message } from './store/network'
  import { onMount } from 'svelte'

  const onMessage = async (peer: ConnectedPeer, ev: MessageEvent<any>) => {
    let msg: Message = await JSON.parse(ev.data)
    msg.from = peer.id
    msg.timestamp = Date.now()
    $messages.push(msg)
  }

  const setSeen = (peerId: string) => {
    $seens.set(peerId, Date.now())
    console.log($seens)
  }

  onMount(async () => {
    if ('standalone' in window.navigator) document.body.classList.add('standalone')
    await $connection
    $connection.on('connected', () => console.log('p2p connected!'))
    $connection.on('kill', () => console.log('p2p connection killed.'))
    $connection.on('warn', console.warn)
    $connection.on('peer-seen', (pid: string) => setSeen(pid))
    $connection.on('peer', (peer: ConnectedPeer) => {
      $peers.set(peer.id, peer)
      // peer.on('stream', stream => { .. })
      // peer.on('data', data => { .. })
      peer.on('message', async (ev) => await onMessage(peer, ev))
      peer.on('error', console.error)
      peer.on('close', () => $peers.delete(peer.id))
    })
    $connection.swarm(name)
    console.debug($connection)
  })
</script>

<style>
</style>

<main class="w-full h-full flex">
  <div class="w-full h-full flex flex-col sm:flex-row">
    <Controls />
  </div>
</main>
