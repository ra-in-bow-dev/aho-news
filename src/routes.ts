import RoomPage from './pages/room.svelte'
import ThreadPage from './pages/thread.svelte'

export default [
  {
    path: '/',
    component: RoomPage,
  },
  {
    path: '/thread/:threadId',
    component: ThreadPage,
    options: {
      transition: 'f7-push',
    }
  }
]