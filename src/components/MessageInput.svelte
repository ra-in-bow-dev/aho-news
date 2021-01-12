<script lang="ts">
  import type { Session } from '../store/session'
  import type { Message } from '../store/message'
  import { peers, seens } from '../store/session'
  import { messages } from '../store/message'
  import getMessage from '../generators/message'
  import { connection } from '../store/network'
  import { getLightColor } from '../generators/color'

  let element

  // handles send message event from user
  function sendMessage(_ev) {
    // create a message structure
    const msg: Message = <Message>{
      ...getMessage(),
      body: element.textContent,
      from: $connection.peerID, // this changes between sessions
    }

    // find those who were here around a week
    const filteredPeers = [] // mostly everyone
    $seens.forEach((session: Session, peerId: string) => {
      if (Date.now() - session.timestamp < 7 * 24 * 60 * 60 * 1000)
        filteredPeers.push(peerId) // seen last week
    })

    // send them a message
    filteredPeers.forEach((x: string) =>
      $peers.get(x).send(JSON.stringify(msg))
    )

    // save in own store
    $messages.set(msg.id, msg)
  }
</script>

<div
  bind:this={element}
  style={`background-color:${getLightColor()}; opacity: 0.8;`}
  class="inputbox bg-gray border rounded border-gray-300"
  contenteditable="true"
  placeholder="Type your message"
/>
<button on:click={sendMessage}>send</button>

<style>
  .inputbox {
    position: fixed;
    display: flex;
    margin-top: 90%;
    width: 100%;
    left: 0%;
    height: 10%;
  }
</style>
