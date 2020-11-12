import RoomPage from './pages/room.svelte'
import ThreadPage from './pages/thread.svelte'

export default [
  {
    path: '/',
    component: RoomPage,
    master: true,
    detailRoutes: [
      {
        path: '/thread/:id',
        component: ThreadPage,
      },
    ]
  },
]