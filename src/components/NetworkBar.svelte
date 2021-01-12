<script lang="ts">
  import type { Session } from '../generators/session'
  import { getLightColor } from '../generators/color'

  export let sessions: Session[]
</script>

<ul>
  {#each sessions as session}
    <li>
      <div
        data-username={session.username}
        data-userpic={session.userpic}
        data-seen={session.timestamp}
        data-peer={session.peerId}
        style={`background-color: ${getLightColor()}`}
        class="peer-circle"
      >
        &nbsp;
      </div>
    </li>
  {/each}
</ul>

<style>
  ul {
    position: fixed;
    height: 2vh;
    padding: 0;
    margin: 0;
    width: 100%;
    background-color: #444;
    text-align: left;
  }

  li {
    list-style-image: none;
    list-style-type: none;
    display: inline-block;
    margin-left: 1vw;
    color: white;
  }

  .peer-circle {
    width: 2vw;
    height: 2vw;
    border-radius: 50%;
    cursor: pointer;
    vertical-align: middle;
    display: table-caption;
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
