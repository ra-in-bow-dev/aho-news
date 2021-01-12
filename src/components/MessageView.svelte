<script lang="ts">
  import type { Message } from '../store/message'
  import { connection } from '../store/network'
  import { seens } from '../store/session'

  // between css classes
  export let mode // bar letter card full

  // these two params are used to switch
  const showDetails = false
  // TODO: implement a few states:
  // - in-chat view
  // - as-item in list
  // - as-card in list
  export let message: Message

  const getReactions = (mid: string) => {
    const r: Array<Message> = []

    return r
  }

  const mention = (bob: string) => {
    // realy simple logic, can be better
    message.body = message.body.split('**, ')[1] || message.body
    message.body = `**@${bob}**, ` + message.body
  }

  const chatWith = (bob: string) => {
    $connection.findHost(bob)
    // TODO: open modal/new window with p2p chat
  }
</script>

<div
  class="min-w-screen min-h-screen bg-gray-200 flex items-center justify-center px-5 py-5"
>
  <div
    class="{`w-full mx-auto rounded-lg bg-white shadow p-5 text-gray-800 ${mode}`}"
    style="max-width: 400px"
  >
    <div class="w-full flex mb-4" class:hidden="{!showDetails}">
      <div class="overflow-hidden rounded-full w-12 h-12">
        <img src="{$seens.get(message.from).userpic}" alt="someone" />
      </div>
      <div class="flex-grow pl-3">
        <button
          class="font-bold text-md"
          on:click="{() => mention(message.from)}"
        >
          @{$seens.get(message.from).username || message.from}
        </button>
        <button
          class="text-xs text-gray-600"
          on:click="{() => chatWith(message.from)}"
        >pm</button>
      </div>
    </div>
    <div class="w-full mb-4">
      <p class="text-sm">{message.body}</p>
    </div>
    <div class="w-full">
      <p class="text-xs text-gray-500 text-right">
        {new Date(message.timestamp)}
      </p>
    </div>
  </div>
</div>
