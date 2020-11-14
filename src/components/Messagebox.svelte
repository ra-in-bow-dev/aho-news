<Messagebar
  placeholder="Type something.."
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
<script lang="ts">
  
  import {
        f7,
        f7ready,
        Messagebar,
        MessagebarAttachment,
        MessagebarAttachments,
        MessagebarSheet,
        MessagebarSheetImage,
        Icon
    } from 'framework7-svelte'
  import { onMount } from 'svelte'
  import { peers } from '../store'
  import type { Message } from '../store'
  import type { ConnectedPeer } from 'switchboard.js'
  
  let sheetVisible: boolean = false
  let attachmentsVisible
  let responseInProgress: boolean = false
  let messagebarComponent
  let messagebarInstance
  let attachments = []
  let images = []
  let messageText = ''
  let placeholder = 'Message'

  export let reply_to

  $: attachmentsVisible = attachments.length > 0
  $: placeholder = attachments.length > 0 ? 'Add comment or Send' : 'Message'

  const sendMessage = (_ev) => {
    if (responseInProgress) return
    responseInProgress = true
    sheetVisible = false
    messageText = ''
    const text: string = messageText.replace(/\n/g, '<br>').trim()
    messagebarInstance.clear()
    if (text.length + attachments.length > 0) {
      // there is something to send
      let messagesToSend: Array<Message> = []
      attachments.forEach((body: string) => messagesToSend.push({ type: 'image', body, reply_to }))
      messagesToSend.push({ type: 'text', body: text, reply_to })
      messagebarInstance.focus()
      messagesToSend.forEach((msg: Message) => {
        $peers.forEach((peer: ConnectedPeer, _peerId: string) => peer.send(JSON.stringify(msg)))
      })
    }
  }

  const handleAttachment = (ev) => {
    const image: string =
        images[f7.$(ev.target).parents('label.checkbox').index()]
    ev.target.checked
        ? attachments.unshift(image)
        : attachments.splice(attachments.indexOf(image), 1)
    }

  const deleteAttachment = (a: string) =>
    attachments.splice(attachments.indexOf(a), 1)
  
  onMount(() =>
    f7ready(() => (messagebarInstance = messagebarComponent.instance()))
  )

</script>