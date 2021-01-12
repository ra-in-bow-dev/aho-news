<script lang="ts">
  import marked from 'marked'
  import { onMount } from 'svelte/internal'
  import './global.css'
  import type { ConnectedPeer } from 'switchboard.js'
  import MessageView from './components/MessageView.svelte'
  import MessageInput from './components/MessageInput.svelte'
  import type { Message } from './store/message'
  import { threads, messages, messagesOrdered } from './store/message'
  import type { Session } from './store/session'
  import { connection } from './store/network'
  import {
    peers,
    seens,
    settings,
    currentSwarm,
    content,
  } from './store/session'
  import { hash } from 'spark-md5'
  import generateUsername from './generators/username'
  import generateUserpic from './generators/userpic'

  const name = 'aho-news' // App name
  const id = 'org.welcomehome.ahonews'
  let connected = false
  let sessions = []
  const rates: Map<string, Array<Message>> = new Map()
  const fixes: Map<string, Array<Message>> = new Map()
  let processedMessages: Array<Message> = []

  const enteredMessage: Message = <Message>{
    timestamp: Date.now(),
    type: 'text',
    body: '',
    id: null,
    reply_to: null,
    from: null,
  }

  const getFirstReply = (cur: Message, prev?: Message) => {
    if (prev && cur.id !== prev.id && prev.reply_to === null) {
      return prev // quit recursion
    }
    if (!prev) {
      // start a recursion
      cur = $messagesOrdered.find((m) => m.reply_to === cur.id)
      prev = $messagesOrdered.find((m) => m.id === cur.reply_to)
      return getFirstReply(cur, prev)
    } else {
      cur = prev
      prev = $messagesOrdered.find((m) => m.reply_to === prev.id)
      return getFirstReply(cur, prev)
    }
  }

  $: if ($messages) {
    // pick only the one thread
    // WARNING: check computional cost here
    processedMessages = $messagesOrdered.filter(
      (m) => getFirstReply(m).id === enteredMessage.reply_to
    )
    //console.log(`thread filtering cost: ${Date.now() - ts1}`)
    if (processedMessages.length > 0)
      console.log(`${processedMessages.length} messages in the thread`)
  }

  const allReplied: Map<string, Message> = new Map()

  const isLastMessage = (msg: Message): boolean => {
    $messagesOrdered.forEach((m) =>
      allReplied.set(m.reply_to, $messages.get(m.reply_to))
    )
    return msg.id in allReplied
  }

  const onMessage = async (peer: ConnectedPeer, ev: MessageEvent<any>) => {
    const msg: Message = await JSON.parse(ev.data)
    msg.from = peer.id
    msg.timestamp = Date.now()
    $messages.set(msg.id, msg)
  }

  const setSeen = (peerId: string) => {
    const s = $seens.get(peerId) || {}
    $seens.set(peerId, <Session>{ ...s, timestamp: Date.now() })
  }

  onMount(async () => {
    // load settings
    $settings = JSON.parse(localStorage.getItem('settings'))
    settings.subscribe((val) =>
      localStorage.setItem('settings', JSON.stringify(val))
    )

    // connection is a promise
    if (await $connection) {
      connected = false
      $connection.removeAllListeners()

      const seenHandler = async (peerId: string) => {
        const old = $seens.get(peerId)
        const timestamp = old?.timestamp || Date.now()
        const username = old?.username || (await generateUsername())
        const userpic = old?.userpic || (await generateUserpic()) // TODO: the way to edit userpic
        const session = <Session>{
          peerId,
          timestamp,
          username,
          userpic,
        }
        $seens.set(peerId, session) // last seen always updating
        sessions = Array.from($seens.values())
      }

      const peerHandler = (peer: ConnectedPeer) => {
        if (!$peers.get(peer.id)) {
          console.info('peer: ' + peer.id)

          const announce = async () => peer.send(JSON.stringify($content)) // simple key:string -> value:markdown_content

          const msgHandler = async (ev: MessageEvent<any>) => {
            // TODO: P2P-CDN datachannel
            console.debug(ev)
            // parse
            const msg: Message = await JSON.parse(ev.data)
            // auto fields
            msg.from = peer.id
            msg.timestamp = Date.now()
            msg.id = hash(
              [msg.from, msg.body, msg.timestamp].join('') +
                Math.random().toString()
            )
            // save new message
            $messages.set(msg.id, msg)
          }
          $peers.set(peer.id, peer)
          // TODO: peer.on('stream', stream => { .. })
          // TODO: peer.on('data', data => { .. })
          peer.on('message', msgHandler)
          peer.on('error', console.error)
          peer.once('close', () => $peers.delete(peer.id))
        }
      }

      $connection.once('connected', () => console.log('p2p connected!'))
      $connection.once('kill', () => console.log('p2p connection killed.'))
      // $connection.on('warn', console.warn)
      $connection.on('peer-seen', seenHandler)
      $connection.on('peer', peerHandler)

      console.info('connecting to #' + $currentSwarm)
      sessions = []
      $connection.swarm($currentSwarm)
      // console.debug($connection)
    }
  })
</script>

<main class="w-full h-full flex">
  <div class="w-full h-full flex flex-col sm:flex-row">
    <div class="seen">
      {#each [...$seens.keys()] as peer}
        {#if Date.now() - $seens.get(peer).timestamp < 10 * 60 * 1000}
          <svg
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            fill="{`#${peer.slice(3)}`}"
          >
            <circle cx="50" cy="50" r="50"></circle>
          </svg>
        {/if}
      {/each}
    </div>
    <div class="messages">
      {#each $threads as m}
        <MessageView message="{m}" mode="bar">
          {@html marked(m.body)}
        </MessageView>
      {/each}
    </div>
    <MessageInput />
  </div>
</main>
