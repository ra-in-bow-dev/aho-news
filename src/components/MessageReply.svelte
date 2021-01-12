<script lang="ts">
  import MessageInput from './MessageInput.svelte'
  const showInputbox = false
</script>

<div class="flex-1 h-full flex space-x-4 justify-center items-center">
  <div
    class="w-16 h-16 focus:outline-none opacity-50 hover:opacity-100"
    on:click={() => showInputbox != showInputbox}
  >
    {showInputbox ? "don't reply" : 'reply'}

    {#if showInputbox}
      <MessageInput />
    {/if}
  </div>
</div>
