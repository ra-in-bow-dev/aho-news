<script lang="ts">
  import type { Message } from '../store/message'
  import { replyTo, messages } from '../store/message'
  import { seens } from '../store/session'
  import { connection, peers } from '../store/network'
  import { getGradientStyle } from '../generators/color'
  import marked from 'marked'
  import generateMessageId from '../generators/uid'

  let element
  let value
  // handles send message event from user
  function sendMessage(_ev) {
    // create a message structure
    const timestamp = Date.now()
    let msg: Message = <Message>{
      body: element.textContent,
      reply_to: $replyTo,
      from: $connection.peerID, // this changes between sessions
      timestamp,
    }
    msg.id = generateMessageId([
      msg.from,
      msg.body,
      timestamp.toString(),
      '#aho-news',
    ])

    // send them a message
    Array.from($seens.keys()).forEach((x: string) =>
      $peers.get(x).send(JSON.stringify(msg))
    )

    // save in own store
    $messages.set(msg.id, msg)
  }
</script>

<section class="message-input">
  {#if $replyTo}
    <div class="message-reply-to">
      <h5>Reply to: {$replyTo}</h5>
      {@html marked(($messages.get($replyTo) || { body: '' }).body)}
    </div>
  {/if}
  <div class="preview">
    {@html marked(value || '')}
  </div>
  <textarea
    bind:value
    bind:this={element}
    style={`${getGradientStyle()}`}
    class="inputbox w-full h-full"
    placeholder="Type your message"
  />
  <button class="btn" on:click={sendMessage}>send</button>
</section>

<style>
  .inputbox {
    display: flex;
    box-sizing: border-box;
    margin-top: 90%;
    width: 100%;
    left: 0%;
    height: 10%;
  }

  .btn {
    outline: none;
    border: 0;
    border-radius: 0;
  }
</style>
