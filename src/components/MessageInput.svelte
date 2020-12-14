<script lang="ts">
import { peers, seens, Session, messages } from '../store/session'
import type { Message } from '../store/message'
import { hash } from 'spark-md5'
import { connection } from '../store/network'

export let message: Message
let element

// generating message id here!
const getID = (ss: string[]) => hash(ss.join('') + Math.random().toString())

// handles send message event from user
function sendMessage(_ev) {

  // create a message structure
  let msg: Message = <Message>{
    body: element.textContent,
    from: $connection.peerID, // this changes between sessions
    timestamp: Date.now(),
    ...message
  }

  // generate a unique id
  msg.id = getID([msg.body, msg.from, msg.timestamp.toString()])

  // check if msg is an image and set its type
  const imageReg = /[\/.](gif|jpg|jpeg|tiff|png)$/i
  msg.type = imageReg.test(msg.body)?'image':'text'

  // find those who were here around a week 
  let filteredPeers = []
  $seens.forEach((session: Session, peerId: string) => {
    if((Date.now() - session.timestamp) < 7*24*60*60*1000)
      filteredPeers.push(peerId) // seen last week
  })

  // send them a message
  filteredPeers.forEach((x: string) => $peers.get(x).send(JSON.stringify(msg)))

  // save in own store
  $messages.push(msg)
}

</script>
<div
  bind:this={element}
  class="inputbox bg-gray border rounded border-gray-300" 
  contenteditable 
  placeholder="Speak or type your message">
</div>
<style>
  .inputbox {
    position: absolute;
    width: 100%;
    height: 100px;
  }
</style>