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
      href={''}
      on:click="{() => (sheetVisible = !sheetVisible)}"
    >
      <Icon
        ios="f7:camera_fill"
        aurora="f7:camera_fill"
        md="material:camera_alt"
      />
    </a>
    <a href={''} class="link icon-only" slot="inner-end" on:click="{sendMessage}">
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
    {#each $messages as m}
      <Message
        first="{!m.reply_to}"
        last="{isLastMessage(m)}"
        htmlText="{m.body}"
      />
    {/each}
  </Messages>
</Page>

<script lang='ts'>
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
    MessagebarSheetImage
  } from 'framework7-svelte'

  import { messages } from '../store'

  let messagebarComponent
  let messagebarInstance
  let attachments: Array<string> = []
  let sheetVisible: boolean = false
  let messageText: string = ''
  let responseInProgress: boolean = false
  
  export let images: Array<string>

  $: attachmentsVisible = attachments.length > 0
  $: placeholder = attachments.length > 0 ? 'Add comment or Send' : 'Message'

  onMount(() => f7ready(() => messagebarInstance = messagebarComponent.instance()))
  
  let allReplied: Map<string, Message> = new Map()
  const isLastMessage = (msg: Message): boolean => {
    $messages.forEach(m => allReplied.set(m.reply_to, $messages.find(msg => msg.id === m.reply_to)))
    return msg.id in allReplied
  }

  const deleteAttachment = (a: string) => attachments.splice(attachments.indexOf(a), 1)

  function handleAttachment(e) {
    const image: string = images[f7.$(e.target).parents('label.checkbox').index()]
    e.target.checked ? attachments.unshift(image) : attachments.splice(attachments.indexOf(image), 1)
  }

  function sendMessage() {
    const text: string = messageText.replace(/\n/g, '<br>').trim()
    const messagesToSend: Array<Message> = []
    attachments.forEach((image) => messagesToSend.push({ image }))
    if (text.length) messagesToSend.push({ text })
    if (messagesToSend.length === 0) return
    attachments = []
    sheetVisible = false
    messageText = ''
    messagebarInstance.clear()
    if (text.length) messagebarInstance.focus()
    if (responseInProgress) return
    responseInProgress = true
  }
</script>
