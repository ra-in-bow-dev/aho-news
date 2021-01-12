<script lang="ts">
  import { getLightColor } from '../generators/color'
  import { sessions } from '../store/session'
</script>

{#each $sessions as session}
  <div
    class="peer-circle"
    data-username={session.username}
    data-userpic={session.userpic}
    data-seen={session.timestamp}
    data-peer={session.peerId}
    style={`background-color: ${getLightColor()}`}
  >
    &nbsp;
  </div>
{/each}

<style>
  .peer-circle {
    display: inline-block;
    width: 2vw;
    height: 2vw;
    border-radius: 50%;
    cursor: pointer;
  }

  .peer-circle::after {
    opacity: 0;
    top: 5vh;
    padding: 1vw;
    transition: 0.5s ease-out;
    transform: translateY(-50%);
    background-color: #444;
    content: attr(data-username);
    position: absolute;
  }

  .peer-circle:hover::after {
    opacity: 1;
  }
</style>
