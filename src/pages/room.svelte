<Page
  name="room"
  infinite
  infiniteDistance="{30}"
  infinitePreloader="{showPreloader}"
>
  <Navbar small title="AHO NEWS" />
  {#if $messages.length > 0}
    <List mediaList>
      {#each threads as msg, i}
        <ListItem
          swipeout
          title="{msg.body.slice(0, 20) + '..'}"
          href="/thread/{msg.id}"
          routeProps="{{ msg }}"
          reloadDetail="{true}"
        >
          <p>{@html msg.body}</p>
          <i slot="media">{i + 1}</i>
        </ListItem>
      {/each}
    </List>
  {:else}
    <div class="preloader-backdrop"></div>
    <div class="preloader-modal">
      <Preloader color="multi" />
    </div>
  {/if}
</Page>

<script lang='ts'>
  import { messages } from '../store'
  import type { Message } from '../store'
  import {
    Page,
    Navbar,
    List,
    ListItem,
    Preloader
  } from 'framework7-svelte'

  // TODO: pagination
  // let page: number = 1
  // let allowInfinite: boolean = true
  let showPreloader: boolean = false
  export let threads: Array<Message> = []

  $: getThreads() // pagination: pass page here
  $: showPreloader = $messages && $messages.length < 299

  function getThreads() { 
    threads = $messages.filter(m => !m.reply_to).sort((a,b) => a.timestamp > b.timestamp ? 1 : -1)

  }

  // pagination: page increment here
  // function loadMore() {
    // if (!allowInfinite) return
    // allowInfinite = false
    // if (!showPreloader) return
    // page += 1
  // }
</script>
