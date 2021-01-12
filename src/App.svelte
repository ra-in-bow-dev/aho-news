<script lang="ts">
  import NetworkBar from './components/NetworkBar.svelte'
  import { onMount, onDestroy } from 'svelte/internal'
  import './global.css'
  import type { ConnectedPeer } from 'switchboard.js'
  import MessageView from './components/MessageView.svelte'
  import MessageInput from './components/MessageInput.svelte'
  import type { Message } from './store/message'
  import { threads, messages, messagesOrdered, replyTo } from './store/message'
  import type { Session } from './generators/session'
  import { connection, peers } from './store/network'
  import {
    seens,
    currentSwarm,
    content,
    settings,
    sessions,
  } from './store/session'
  import generateUsername from './generators/username'
  // import generateUserpic from './generators/userpic'
  import generateMessageId from './generators/uid'

  const weekOld = (ts) => Date.now() - ts < 7 * 24 * 60 * 60 * 1000
  const name = 'aho-news' // App name
  const id = 'org.welcomehome.ahonews'
  const rates: Map<string, Array<Message>> = new Map()
  const fixes: Map<string, Array<Message>> = new Map()
  let processedMessages: Array<Message> = []

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
      (m) => getFirstReply(m).id === $replyTo
    )
    //console.log(`thread filtering cost: ${Date.now() - ts1}`)
    if (processedMessages.length > 0)
      console.log(`${processedMessages.length} messages in the thread`)
  }

  onMount(async () => {
    'serviceWorker' in navigator &&
      navigator.serviceWorker.register('/service-worker.js')

    $settings = JSON.parse(localStorage.getItem('settings'))
    settings.subscribe((val) =>
      localStorage.setItem('settings', JSON.stringify(val))
    )

    let sss = await JSON.parse(localStorage.getItem('seens') || '[]')
    sss.forEach((session) => {
      if (weekOld(session.timestamp)) $seens.set(session.peerId, session)
    })

    console.log($seens)

    // connection is a promise
    if (await $connection) {
      console.log('connection is ok')
      $connection.removeAllListeners()

      const seenHandler = async (peerId: string) => {
        const old = $seens.get(peerId)
        const timestamp = old?.timestamp || Date.now()
        const username = old?.username || (await generateUsername())
        // const userpic = old?.userpic || (await generateUserpic()) // TODO: the way to edit userpic
        const session = <Session>{
          peerId,
          timestamp,
          username,
          // userpic,
        }
        $seens.set(peerId, session) // last seen always updating
        console.log(`peer: seen ${peerId}`)
        $sessions = Array.from($seens.values()).filter((s) =>
          weekOld(s.timestamp)
        )
      }

      const peerHandler = (peer: ConnectedPeer) => {
        if (!$peers.get(peer.id)) {
          console.info('peer: announce for ' + peer.id)
          // console.info('peer: sending own content to the new peer')
          peer.send(JSON.stringify($content)) // simple key:string -> value:markdown_content

          const msgHandler = async (ev: MessageEvent<any>) => {
            const datachannel = ev.target
            // parse
            let msg: Message = await JSON.parse(ev.data) // { body reply_to }
            const timestamp = Date.now()
            msg = <Message>{
              timestamp,
              from: peer.id,
              id: generateMessageId([
                peer.id,
                msg.body,
                timestamp.toString(),
                '#aho-news',
              ]),
            }
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
      $connection.swarm($currentSwarm)
      // console.debug($connection)
    }
  })

  onDestroy(async () => {
    // find those who were here around a week
    const filteredPeers = [] // mostly everyone
    $seens.forEach((session: Session, peerId: string) => {
      if (weekOld(session.timestamp)) filteredPeers.push(peerId) // seen last week
    })
    localStorage.setItem('seens', JSON.stringify(filteredPeers))
    localStorage.setItem('settings', JSON.stringify($settings))
  })
</script>

<main class="flex flex-col h-screen justify-between">
  <section class="seen">
    <NetworkBar />
  </section>
  <section class="flex-grow messages">
    {#each $threads as message}
      <MessageView
        {message}
        mode="bar"
        on:click={() => ($replyTo = message.id)}
      />
    {/each}
  </section>
  <section class="input">
    <MessageInput />
  </section>
</main>
