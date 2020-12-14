<script lang="ts">
  import { onMount } from 'svelte/internal'
  import "./global.css"
  import type { ConnectedPeer } from 'switchboard.js'
  import MessageView from './components/MessageView.svelte'
  import MessageInput from './components/MessageInput.svelte'
  import type { Message } from './store/message'
  import { connection } from './store/network'
  import { peers, seens, threads, messages, settings, Settings } from './store/session'
  
  const name: string = 'aho-news' // App name
  const id: string = 'org.welcomehome.ahonews'

  let rates: Map<string, Array<Message>> = new Map()
  let fixes: Map<string, Array<Message>> = new Map()
  let processedMessages: Array<Message> = []
  let enteredMessage: Message = <Message>{
    type: 'text', 
    body: '', 
    id: null, 
    reply_to: null, 
    from: null
  }

  const getFirstReply = (cur: Message, prev?: Message) => {
    if (prev && cur.id !== prev.id && prev.reply_to === null) {
      return prev // quit recursion
    }
    if (!prev) {
      // start a recursion
      cur = $messages.find((m) => m.reply_to === cur.id)
      prev = $messages.find((m) => m.id === cur.reply_to)
      return getFirstReply(cur, prev)
    } else {
      cur = prev
      prev = $messages.find((m) => m.reply_to === prev.id)
      return getFirstReply(cur, prev)
    }
  }

  $: if($messages) {
    //let ts1 = Date.now()
    // pick only the one thread
    // WARNING: check computional cost here
    processedMessages = $messages.filter((m) => getFirstReply(m).id === enteredMessage.reply_to)
    //console.log(`thread filtering cost: ${Date.now() - ts1}`)
    if(processedMessages.length > 0) console.log(`${processedMessages.length} messages in the thread`)
    // update this thread's fixes
    processedMessages.forEach((m) => {
      if (m.type === 'fix') fixes[m.reply_to].push(m)
    })
    // update this thread's rates
    processedMessages.forEach((m) => {
      if (m.type === 'rate') rates[m.reply_to].push(m)
    })
  }

  let allReplied: Map<string, Message> = new Map()

  const isLastMessage = (msg: Message): boolean => {
    $messages.forEach((m) =>
      allReplied.set(
        m.reply_to,
        $messages.find((msg) => msg.id === m.reply_to)
      )
    )
    return msg.id in allReplied
  }

  const onMessage = async (peer: ConnectedPeer, ev: MessageEvent<any>) => {
    let msg: Message = await JSON.parse(ev.data)
    msg.from = peer.id
    msg.timestamp = Date.now()
    $messages.push(msg)
  }

  const setSeen = (peerId: string) => {
    let s = $seens.get(peerId) || {}
    $seens.set(peerId, {...s, timestamp: Date.now()})
  }

  onMount(async () => {
    // session settings in localStorage
    $settings = JSON.parse(localStorage.getItem("settings"))
    settings.subscribe(val => localStorage.setItem("settings", JSON.stringify(val)))
    // add standalone detecting class if needed
    if ('standalone' in window.navigator) document.body.classList.add('standalone')
    // connection is a promise
    await $connection
    $connection.on('connected', () => console.log('p2p connected!'))
    $connection.on('kill', () => console.log('p2p connection killed.'))
    $connection.on('warn', console.warn)
    $connection.on('peer-seen', (pid: string) => setSeen(pid))
    $connection.on('peer', (peer: ConnectedPeer) => {
      $peers.set(peer.id, peer)
      // TODO: peer.on('stream', stream => { .. })
      // TODO: peer.on('data', data => { .. })
      peer.on('message', async (ev) => await onMessage(peer, ev))
      peer.on('error', console.error)
      peer.on('close', () => $peers.delete(peer.id))
    })
    // always use the same swarm in this app
    $connection.swarm(name)
    console.debug($connection)
  })
  
  
  $: if($seens) {

  }
</script>

<style>
</style>

<main class="w-full h-full flex">
  <div class="w-full h-full flex flex-col sm:flex-row">
    <div class="seen">
      {#each [...$seens.keys()] as peer}
      {#if (Date.now() - $seens.get(peer).timestamp) < 10*60*1000 }
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill={`#${peer.slice(3)}`} >
        <circle cx="50" cy="50" r="50"/>
      </svg>
      {/if}
      {/each}
    </div>
    <div class="messages">
      {#each $threads as m}
        <MessageView message={m} mode='bar'>
          {#if m.type === 'image'}
            <img src={m.body} alt='pic' />
          {:else}
            <p>${m.body}</p>
          {/if}
        </MessageView>
      {/each}
    </div>
    <MessageInput  />
  </div>
</main>
