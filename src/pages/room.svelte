<Page name="room">
  {#if showPreloader}
    <Block class="justify-content-center">
      <Preloader color="multi" style="background: #fff;" />
    </Block>
  {:else}
    {#each $threads as msg}
      <a href="/thread/{msg.id}">
        <Card expandable title="{msg.body.slice(0, 20) + '..'}">
          <CardContent>
            {#if msg.type==='image'}
              <img src={msg.body} alt='pic'/>
            {/if}
            {#if msg.type==='text'}
              <p>{msg.body}</p>
            {/if}
          </CardContent>
        </Card>
      </a>
    {/each}
    {#if showMessagebox}
      <Messagebox />
    {/if}
  {/if}
</Page>

<script lang='ts'>
  import { threads } from '../store'
  import {
    // Appbar,
    Block,
    Link,
    Page,
    Card,
    CardContent,
    Preloader
  } from 'framework7-svelte'
  import Messagebox from '../components/Messagebox.svelte'

  // TODO: pagination with infinite scrolling

  let showPreloader: boolean = false
  let showMessagebox: boolean = false
  $: showPreloader = !!$threads

 </script>
