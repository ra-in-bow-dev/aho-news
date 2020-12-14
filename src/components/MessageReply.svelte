<script lang="ts">
import type { Message } from '../store/message'
import MessageInput from './MessageInput.svelte'

  export let message: Message
  let showInputbox: boolean = false
</script>

<div class="flex-1 h-full flex space-x-4 justify-center items-center">
  <button 
    class="w-16 h-16 focus:outline-none opacity-50 hover:opacity-100"
    on:click={() => showInputbox != showInputbox }
  >
    { showInputbox ? 'don\'t reply' : 'reply' }
  </button>
  {#if showInputbox}<MessageInput message={message} />{/if}
</div>