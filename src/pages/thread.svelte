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

<Page>
  <Messagebar
    placeholder="{placeholder}"
    bind:this="{messagebarComponent}"
    attachmentsVisible="{attachmentsVisible}"
    sheetVisible="{sheetVisible}"
    value="{messageText}"
    onInput="{(e) => (messageText = e.target.value)}"
  >
    <a
      class="link icon-only"
      slot="inner-start"
      href="{''}"
      on:click="{() => (sheetVisible = !sheetVisible)}"
    >
      <Icon
        ios="f7:camera_fill"
        aurora="f7:camera_fill"
        md="material:camera_alt"
      />
    </a>
    <a
      href="{''}"
      class="link icon-only"
      slot="inner-end"
      on:click="{sendMessage}"
    >
      <Icon
        ios="f7:arrow_up_circle_fill"
        aurora="f7:arrow_up_circle_fill"
        md="material:send"
      />
    </a>

    <MessagebarAttachments>
      {#each attachments as image, index (index)}
        <MessagebarAttachment
          key="{index}"
          image="{image}"
          onAttachmentDelete="{() => deleteAttachment(image)}"
        />
      {/each}
    </MessagebarAttachments>

    <MessagebarSheet>
      {#each images as image, index (index)}
        <MessagebarSheetImage
          key="{index}"
          image="{image}"
          checked="{attachments.indexOf(image) >= 0}"
          onChange="{handleAttachment}"
        />
      {/each}
    </MessagebarSheet>
  </Messagebar>

  <Messages>
    {#each processedMessages as m}
      {#if m.type === 'text'}
        <Message
          first="{!m.reply_to}"
          last="{isLastMessage(m)}"
          htmlText="{`<p>${m.body}</p>`}"
        />
      {/if}
      {#if m.type === 'image'}
        <Message
          first="{!m.reply_to}"
          last="{isLastMessage(m)}"
          htmlText="{`<img src=${m.body} alt='pic' />`}"
        />
      {/if}
      <!-- 
        TODO: components accepting media-url 
        TODO: CDN for uploading media
      {#if m.type==='video'}
        <VideoCircle mediaUrl={m.body} />
      {/if}
      {#if m.type==='audio'}
        <AudioPlayer mediaUrl={m.body} />
      {/if}
      -->
    {/each}
  </Messages>
</Page>

<script lang="ts">
  import type { ConnectedPeer } from 'switchboard.js'
  import { onMount } from 'svelte'
  import {
    f7,
    f7ready,
    Page,
    Messages,
    Message,
    Messagebar,
    Icon,
    MessagebarAttachments,
    MessagebarAttachment,
    MessagebarSheet,
    MessagebarSheetImage,
  } from 'framework7-svelte'

  import { messages, peers } from '../store'

  export let threadId: string

  let messagebarComponent = null
  let messagebarInstance = null
  let attachments: Array<string> = []
  let sheetVisible: boolean = false
  let messageText: string = ''
  let responseInProgress: boolean = false
  let processedMessages: Array<Message> = []
  let rates: Map<string, Array<Message>> = new Map()
  let fixes: Map<string, Array<Message>> = new Map()
  let images: Array<string> = []

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

  $: attachmentsVisible = attachments.length > 0
  $: placeholder = attachments.length > 0 ? 'Add comment or Send' : 'Message'
  $: processedMessages = ((): Array<Message> => {
    let ts1 = Date.now()
    let r = []
    // pick only the one thread
    // WARNING: check computional cost here
    r = $messages.filter((m) => getFirstReply(m).id === threadId)
    console.log(`thread filtering cost: ${Date.now() - ts1}`)
    console.log(`${r.length} messages in the thread`)
    // update this thread's fixes
    r.forEach((m) => {
      if (m.type === 'fix') fixes[m.reply_to].push(m)
    })
    // update this thread's rates
    r.forEach((m) => {
      if (m.type === 'rate') rates[m.reply_to].push(m)
    })
    return r
  })()

  // TODO: fixes on view
  // TODO: rates on view

  onMount(() =>
    f7ready(() => (messagebarInstance = messagebarComponent.instance()))
  )

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

  const deleteAttachment = (a: string) =>
    attachments.splice(attachments.indexOf(a), 1)

  function handleAttachment(e) {
    const image: string =
      images[f7.$(e.target).parents('label.checkbox').index()]
    e.target.checked
      ? attachments.unshift(image)
      : attachments.splice(attachments.indexOf(image), 1)
  }

  function sendMessage() {
    if (responseInProgress) return
    responseInProgress = true
    sheetVisible = false
    messageText = ''
    const text: string = messageText.replace(/\n/g, '<br>').trim()
    messagebarInstance.clear()
    if (text.length + attachments.length > 0) {
      // there is something to send
      let messagesToSend: Array<Message> = []
      attachments.forEach((body: string) =>
        messagesToSend.push({ type: 'image', body })
      )
      messagesToSend.push({ type: 'text', body: text })
      messagebarInstance.focus()
      messagesToSend.forEach((msg: Message) => {
        $peers.forEach((peer: ConnectedPeer, _peerId: string) => peer.send(msg))
      })
    }
  }
</script>
