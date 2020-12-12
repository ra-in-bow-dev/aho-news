<Page name="room">
  {#if showMessagebox}
    <Messagebox />
  {:else}
    <div style="margin-left: 47%;">
      <Icon f7="message" size="44px" on:click={ () => showMessagebox = true } />
    </div>
  {/if}
  {#if showPreloader}
    <div style="margin-left: 47%;">
      <Preloader color="multi" style="background: #fff;" />
    </div>
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
  {/if}

</Page>

<script lang='ts'>
  import { threads } from '../store'
  import {
    Icon,
    Page,
    Card,
    CardContent,
    Preloader
  } from 'framework7-svelte'
  import Messagebox from '../components/Messagebox.svelte'

  // TODO: pagination with infinite scrolling

  // NOTE: uses 'master-detail' pattern as master route

  let showPreloader: boolean = false
  let showMessagebox: boolean = false
  $: showPreloader = !!$threads

 </script>
