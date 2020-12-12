<Page>
  
  <Messages>
    {#each processedMessages as m}
      <Message
        first="{!m.reply_to}"
        last="{isLastMessage(m)}"
        htmlText="{m.type === 'image' ? `<img src=${m.body} alt='pic' />`:`<p>${m.body}</p>`}"
      />
    {/each}
  </Messages>

  <Messagebox />
</Page>

<script lang="ts">
  import {
    Page,
    Messages,
    Message,
  } from 'framework7-svelte'
  import Messagebox from '../components/Messagebox.svelte'
  import { messages } from '../store'

  export let threadId: string

  let rates: Map<string, Array<Message>> = new Map()
  let fixes: Map<string, Array<Message>> = new Map()
  let processedMessages: Array<Message> = []

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

  $: {
    let ts1 = Date.now()
    // pick only the one thread
    // WARNING: check computional cost here
    processedMessages = $messages.filter((m) => getFirstReply(m).id === threadId)
    console.log(`thread filtering cost: ${Date.now() - ts1}`)
    console.log(`${processedMessages.length} messages in the thread`)
    // update this thread's fixes
    processedMessages.forEach((m) => {
      if (m.type === 'fix') fixes[m.reply_to].push(m)
    })
    // update this thread's rates
    processedMessages.forEach((m) => {
      if (m.type === 'rate') rates[m.reply_to].push(m)
    })
  }

  // TODO: fixes on view
  // TODO: rates on view

  // NOTE: uses 'master-detail' as detail route
  // see 

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
</script>

<style>
  :global(.view-master-detail
      .navbar-master-detail-root
      .link.back, .view-master-detail
      .page-master-detail-root
      .navbar
      .link.back) {
    display: none;
  }
</style>