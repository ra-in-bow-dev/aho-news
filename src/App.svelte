<App params={{ name, routes, id }}>
  <View main url="/" />
</App>

<script lang="ts">
	import type { ConnectedPeer } from 'switchboard.js'
  import { connection, peers, messages } from './store'
  import type { Message } from './store'
  import { App, View } from 'framework7-svelte'
  import routes from './routes'
  import { onMount } from 'svelte'

  const name: string = 'aho-news' // App name
  const id: string = 'org.welcomehome.ahonews'

  if ('standalone' in window.navigator) document.body.classList.add('standalone')

  const onMessage = async (peer: ConnectedPeer, ev: MessageEvent<any>) => {
    let msg: Message = await JSON.parse(ev.data)
    msg.from = peer.id
    msg.timestamp = Date.now()
    $messages.push(msg)
  }

  onMount(async () => {
    await $connection
    $connection.on('connected', () => console.log('p2p connected!'))
    $connection.on('kill', () => console.log('p2p connection killed.'))
    $connection.on('warn', console.warn)
    $connection.on('peer-seen', (peer: string) => console.log('peer-seen: ', peer))
    $connection.on('peer', (peer: ConnectedPeer) => {
      $peers.set(peer.id, peer)
      // peer.on('stream', stream => { .. })
      // peer.on('data', data => { .. })
      peer.on('message', async ev => await onMessage(peer, ev))
      peer.on('error', console.error)
      peer.on('close', () => $peers.delete(peer.id))
    })
    $connection.swarm(name)
    console.debug($connection)
  })

</script>
<style>
:global(body) {
    --f7-page-master-width: 33%;
}
</style>