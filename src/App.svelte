<App params={f7params}>
  <!-- Your main view, should have "view-main" class -->
  <View main class="safe-areas" url="/" masterDetailBreakpoint={800} />
</App>

<script lang="ts">
	import type { ConnectedPeer } from 'switchboard.js'
  import { connection, peers, messages } from './store'
  import type { Message } from './store'
  import { App, View } from 'framework7-svelte'
  import routes from './routes'
  import { onMount } from 'svelte'

  // Framework7 Parameters
  let f7params = {
    name: 'stock', // App name
    theme: 'auto', // Automatic theme detection
    autoDarkTheme: true, // Automatic Dark Theme
    routes // App routes
  }

  if ('standalone' in window.navigator) document.body.classList.add('standalone')

  const onMessage = async (peer: ConnectedPeer, ev: MessageEvent<any>) => {
    const msg: Message = await JSON.parse(ev.data)
    msg.from = peer.id
    msg.timestamp = Date.now()
    $messages.push(msg)
  }

  onMount(async () => {
    await $connection
    $connection.on('connected', () => console.log('p2p connected!'))
    $connection.on('kill', () => console.log('p2p connection killed.'))
    $connection.on('warn', console.warn)
    $connection.on('peer-seen', peer => console.log('Saw peer: ', peer))
    $connection.on('peer', (peer: ConnectedPeer) => {
      $peers.set(peer.id, peer)
      // peer.on('stream', stream => { .. })
      // peer.on('data', data => { .. })
      peer.on('message', async ev => await onMessage(peer, ev))
      peer.on('error', console.error)
      peer.on('close', () => $peers.delete(peer.id))
    })
    $connection.swarm('aho-news')
    console.debug($connection)
  })

</script>
<style>
:global(body) {
    --f7-page-master-width: 33%;
}
</style>